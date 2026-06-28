const createLogger = require('../../common/helpers/logger.js');
const model = require('./ai.model.js');
const llm = require('./llm.service.js');

const log = createLogger('ai.service');

const MAX_HISTORY_ENTRIES = 40;

/** @type {Map<string, { geminiContents: Array, messageCount: number }>} */
const sessions = new Map();//Map giống như một bộ nhớ lưu trữ tạm thời

function getSession(sessionId) {
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function saveSession(sessionId, geminiContents) {
  if (!sessionId || !geminiContents) return;

  let ctx = sessions.get(sessionId);
  if (!ctx) {// Nếu chưa có session, tạo mới
    ctx = { geminiContents: [], messageCount: 0 };
    sessions.set(sessionId, ctx);
  }

  ctx.geminiContents = geminiContents;//Cập nhật lịch sử chat mới
  ctx.messageCount++;

  while (ctx.geminiContents.length > MAX_HISTORY_ENTRIES) {
    ctx.geminiContents.shift();//loại bỏ phần tử đầu tiên của mảng
  }
}

//Chat 

const UNAVAILABLE_REPLY = 'Xin lỗi, trợ lý AI đang bận. Vui lòng thử lại sau ít giây!';

async function chat(message, sessionId, userId) {
  log.info('chat', { sessionId, userId });

  if (!message || !message.trim()) {
    return {
      intent: 'error',
      context: { session_id: sessionId, message_count: 0 },
      reply: 'Vui lòng nhập nội dung tin nhắn.',
    };
  }
//Lấy lích sử cũ
  const existing = getSession(sessionId);
  const previousContents = existing ? existing.geminiContents : [];

  try {
    //Gọi Gemini qua llm.service.js để nhận phản hồi
    const llmResult = await llm.chat(message, previousContents, { userId, model });

    if (llmResult) {
      const { reply, rooms, booking, geminiContents } = llmResult;
      saveSession(sessionId, geminiContents);

      const ctx = getSession(sessionId);
      return {
        intent: 'llm',
        context: { session_id: sessionId, message_count: ctx ? ctx.messageCount : 1 },
        reply,
        results: rooms && rooms.length > 0 ? rooms : undefined,
        booking: booking || undefined,
      };
    }
  } catch (err) {
    log.error('chat failed', { error: err.message });
  }

  return {
    intent: 'unavailable',
    context: { session_id: sessionId, message_count: existing ? existing.messageCount : 0 },
    reply: UNAVAILABLE_REPLY,
  };
}

//Recommendations
function scoreRoom(room, criteria, maxBookingCount, bookingCounts) {
  const { maxPrice, guests, amenities } = criteria; //tiêu chí yêu cầu
  const roomAmenities = (room.amenities || []).map(a => a.toLowerCase());//chuyển sang chữ thường để dễ so sánh

  // 1. Giá phù hợp (30%) — phòng càng rẻ hơn budget càng tốt
  let priceFit = 0.15; // mặc định nếu không có budget
  if (maxPrice != null && maxPrice > 0) {
    const ratio = (maxPrice - room.price_per_night) / maxPrice; // 1 = rẻ nhất, 0 = đúng budget
    priceFit = Math.max(0, Math.min(ratio, 1)) * 0.30;
  }

  // 2. Số khách phù hợp (15%) — phòng phải đủ chỗ
  let guestFit = 0.075; // mặc định nếu không chỉ định
  if (guests != null) {
    if (room.max_guests < guests) {
      guestFit = 0; // không đủ chỗ → 0 điểm
    } else {
      guestFit = Math.min(guests / room.max_guests, 1) * 0.15;
    }
  }

  // 3. Tiện ích khớp (25%) — bao nhiêu % tiện ích yêu cầu có trong phòng
  let amenityMatch = 0.125; // mặc định nếu không yêu cầu
  if (amenities.length > 0) {
    const matched = amenities.filter(a => roomAmenities.includes(a)).length;
    amenityMatch = (matched / amenities.length) * 0.25;
  }

  // 4. Độ phổ biến (15%) — dựa trên số booking
  const roomBookings = bookingCounts.get(room.room_id) || 0;
  const popularity = (roomBookings / maxBookingCount) * 0.15;

  // 5. Điểm đánh giá khách sạn (15%)
  const reviewRating = ((room.hotel_rating || 0) / 5) * 0.15;

  return priceFit + guestFit + amenityMatch + popularity + reviewRating;
}

async function getRecommendations({ guests, max_price, amenities, limit }) {
  log.info('getRecommendations', { guests, max_price, amenities, limit });

  const effectiveLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
  const requestedGuests = guests != null ? Number(guests) : null;
  const requestedMaxPrice = max_price != null ? Number(max_price) : null;
  const requestedAmenities = amenities
    ? amenities.split(',').map(a => a.trim().toLowerCase()).filter(Boolean)
    : [];

  // Lấy dữ liệu từ DB
  const [candidates, bookingCounts] = await Promise.all([
    model.getCandidateRooms({ guests: requestedGuests, max_price: requestedMaxPrice }),//lấy danh sách phòngphù hợp
    model.getBookingCounts(),
  ]);

  if (candidates.length === 0) return [];

  // Tìm số booking cao nhất (dùng để normalize)
  let maxBookingCount = 0;
  for (const room of candidates) {
    const count = bookingCounts.get(room.room_id) || 0;
    if (count > maxBookingCount) maxBookingCount = count;
  }
  if (maxBookingCount === 0) maxBookingCount = 1;

  // Chấm điểm từng phòng
  const criteria = { maxPrice: requestedMaxPrice, guests: requestedGuests, amenities: requestedAmenities };
  const scored = candidates.map(room => ({
    room_id: room.room_id,
    room_name: room.room_name,
    hotel_id: room.hotel_id,
    hotel_name: room.hotel_name,
    hotel_address: room.hotel_address,
    price_per_night: room.price_per_night,
    max_guests: room.max_guests,
    amenities: room.amenities,
    score: Math.round(scoreRoom(room, criteria, maxBookingCount, bookingCounts) * 100) / 100,
  }));

  // Sắp xếp theo điểm giảm dần
  scored.sort((a, b) => b.score - a.score);

  // Đa dạng hoá: tối đa 2 phòng/khách sạn
  const hotelCount = {};
  const result = [];
  for (const room of scored) {
    hotelCount[room.hotel_id] = (hotelCount[room.hotel_id] || 0) + 1;
    if (hotelCount[room.hotel_id] <= 2) result.push(room);
    if (result.length >= effectiveLimit) break;
  }

  return result;
}

module.exports = { chat, getRecommendations };
