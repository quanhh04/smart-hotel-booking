/**
 * ai.service — Logic cho 2 tính năng AI:
 *   1. chat()              — Trợ lý chat dùng Gemini, có duy trì lịch sử hội thoại theo session.
 *   2. getRecommendations() — Gợi ý phòng dựa trên 5 tiêu chí có trọng số (không cần LLM).
 *
 * Flow của chat:
 *   FE gửi { message, session_id } → service tìm history theo sessionId → gửi cho LLM
 *   → LLM trả về reply + (có thể) danh sách phòng đề xuất → service lưu lại history.
 */
const createLogger = require('../../common/helpers/logger.js');
const model = require('./ai.model.js');
const llm = require('./llm.service.js');

const log = createLogger('ai.service');

// ─── Session Manager ──────────────────────────────────────────────────────────
//
// ⚠️ CẢNH BÁO QUAN TRỌNG (giảng dạy):
//   - sessions là Map IN-MEMORY → mọi history sẽ MẤT khi server restart.
//   - KHÔNG hoạt động đúng khi deploy nhiều instance (mỗi instance có Map
//     riêng → request kế tiếp routing sang instance khác sẽ mất context).
//   - KHÔNG có cơ chế dọn session cũ → memory leak nếu chạy lâu (chỉ giới
//     hạn bằng MAX_HISTORY_ENTRIES bên trong từng session).
//
// Trong production thật nên thay bằng Redis hoặc DB (bảng ai_sessions),
// và thêm TTL (vd 1h không hoạt động → xoá).

const MAX_HISTORY_ENTRIES = 40;

/** @type {Map<string, { geminiContents: Array, messageCount: number }>} */
const sessions = new Map();

function getSession(sessionId) {
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function saveSession(sessionId, geminiContents) {
  if (!sessionId || !geminiContents) return;

  let ctx = sessions.get(sessionId);
  if (!ctx) {
    ctx = { geminiContents: [], messageCount: 0 };
    sessions.set(sessionId, ctx);
  }

  ctx.geminiContents = geminiContents;
  ctx.messageCount++;

  while (ctx.geminiContents.length > MAX_HISTORY_ENTRIES) {
    ctx.geminiContents.shift();
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

const UNAVAILABLE_REPLY = 'Xin lỗi, trợ lý AI đang bảo trì. Vui lòng thử lại sau!';

async function chat(message, sessionId, userId) {
  log.info('chat', { sessionId, userId });

  const existing = getSession(sessionId);
  const previousContents = existing ? existing.geminiContents : [];

  const llmResult = await llm.chat(message, previousContents, { userId, model });

  if (llmResult) {
    const { reply, rooms, booking, geminiContents } = llmResult;
    saveSession(sessionId, geminiContents);

    const ctx = getSession(sessionId);
    return {
      intent: 'llm',
      context: { session_id: sessionId || null, message_count: ctx ? ctx.messageCount : 1 },
      reply,
      results: rooms && rooms.length > 0 ? rooms : undefined,
      booking: booking || undefined,
    };
  }

  log.warn('chat: LLM unavailable');
  return {
    intent: 'unavailable',
    context: { session_id: sessionId || null, message_count: 1 },
    reply: UNAVAILABLE_REPLY,
  };
}

// ─── Recommendations ──────────────────────────────────────────────────────────

/**
 * Tính điểm phù hợp cho 1 phòng dựa trên 5 tiêu chí.
 * Mỗi tiêu chí có trọng số riêng, tổng = 1.0
 *
 * @param {object} room - Phòng ứng viên từ DB
 * @param {object} criteria - { maxPrice, guests, amenities (mảng lowercase) }
 * @param {number} maxBookingCount - Số booking cao nhất trong tất cả phòng
 * @param {Map} bookingCounts - Map<roomId, count>
 * @returns {number} Điểm từ 0 đến 1
 */
function scoreRoom(room, criteria, maxBookingCount, bookingCounts) {
  const { maxPrice, guests, amenities } = criteria;
  const roomAmenities = (room.amenities || []).map(a => a.toLowerCase());

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

/**
 * Gợi ý phòng dựa trên thuật toán scoring (KHÔNG dùng LLM).
 *
 * Quy trình 4 bước:
 *   1. Lấy danh sách phòng ứng viên từ DB (đã filter sơ theo guests + max_price).
 *   2. Lấy thống kê số booking từng phòng → tính độ phổ biến.
 *   3. Chấm điểm từng phòng với scoreRoom() — xem 5 tiêu chí ở đó.
 *   4. Sắp xếp giảm dần + đa dạng hoá (mỗi khách sạn tối đa 2 phòng) → trả về top N.
 *
 * @param {object} params
 * @param {number} [params.guests]     Số khách
 * @param {number} [params.max_price]  Ngân sách tối đa / đêm
 * @param {string} [params.amenities]  Chuỗi tiện ích phân tách bằng dấu phẩy ("wifi,pool")
 * @param {number} [params.limit]      Số phòng muốn trả (mặc định 5, tối đa 20)
 */
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
    model.getCandidateRooms({ guests: requestedGuests, max_price: requestedMaxPrice }),
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
