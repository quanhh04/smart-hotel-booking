/**
 * LLM Service — Gọi Google Gemini API với Function Calling.
 *
 * Flow:
 * 1. User gửi tin nhắn → gửi lên Gemini kèm lịch sử chat
 * 2. Gemini có thể trả lời text HOẶC yêu cầu gọi tool (search_rooms, get_hotel_detail, create_booking)
 * 3. Nếu Gemini gọi tool → thực thi tool → gửi kết quả lại cho Gemini → lặp lại (tối đa 3 vòng)
 * 4. Khi Gemini trả text → trả về cho user
 */
const createLogger = require('../../common/helpers/logger');
const log = createLogger('llm.service');

// ── Config ──────────────────────────────────────────────────────────────────
const GEMINI_KEYS = (process.env.GEMINI_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let currentKeyIndex = 0;

function getGeminiUrl() {
  const key = GEMINI_KEYS[currentKeyIndex] || '';
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
}

function rotateKey() {
  if (GEMINI_KEYS.length <= 1) return false;
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  log.info('Rotated to API key', { index: currentKeyIndex });
  return true;
}

function isEnabled() { return GEMINI_KEYS.length > 0; }

if (GEMINI_KEYS.length > 0) {
  log.info('LLM enabled', { model: GEMINI_MODEL, keyCount: GEMINI_KEYS.length });
} else {
  log.warn('LLM disabled: GEMINI_API_KEY not set');
}

// ── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Bạn là trợ lý đặt phòng khách sạn thông minh của BookingVN. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn.

Bạn có các công cụ (tools) để:
1. search_rooms: Tìm phòng khách sạn theo tiêu chí
2. get_hotel_detail: Xem chi tiết khách sạn theo ID
3. create_booking: Đặt phòng cho khách
4. get_nearby_services: Tìm dịch vụ/địa điểm lân cận khách sạn

QUY TẮC:
- LUÔN gọi search_rooms TRƯỚC khi đặt phòng để lấy room_id.
- KHÔNG hỏi khách về mã ID. Tự lấy từ kết quả search_rooms.
- KHÔNG bịa data — chỉ dùng data từ kết quả tools.
- Nếu thiếu ngày check-in/check-out → HỎI khách trước.
- Giá hiển thị dạng VND (VD: 2.200.000 ₫/đêm).
- Sau khi đặt phòng THÀNH CÔNG → gọi get_nearby_services để lấy gợi ý thực tế rồi trình bày cho khách.
- Khi khách hỏi về ĂN UỐNG, THAM QUAN, SPA, DI CHUYỂN, NIGHTLIFE gần khách sạn → gọi get_nearby_services với category phù hợp.
- Khi trả lời về dịch vụ lân cận:
  + Liệt kê 3-5 gợi ý, mỗi gợi ý 1 dòng có emoji
  + Bao gồm tên, khoảng cách, giá, và **link Google Maps** (nếu có)
  + Format link: [Tên địa điểm](url_google_maps)
  + Cuối cùng HỎI: "Bạn muốn biết thêm về loại dịch vụ nào khác không?"
- Nếu khách hỏi về đặt xe/chuyến bay → trả lời: "Tính năng đặt xe và chuyến bay đang được phát triển, sẽ sớm có mặt trên BookingVN! Hiện tại bạn có thể tham khảo các dịch vụ bên ngoài."
- Nếu get_nearby_services trả về rỗng → gợi ý chung dựa trên địa chỉ khách sạn (thành phố), nhưng ghi rõ "đây là gợi ý chung, bạn nên kiểm tra trên Google Maps".`;

// ── Tool Definitions (Gemini Function Calling format) ───────────────────────
const TOOLS = [{
  functionDeclarations: [
    {
      name: 'search_rooms',
      description: 'Tìm phòng khách sạn. Trả về danh sách phòng với room_id, tên, giá, tiện ích.',
      parameters: {
        type: 'OBJECT',
        properties: {
          city:      { type: 'STRING', description: 'Tên thành phố' },
          min_price: { type: 'NUMBER', description: 'Giá tối thiểu (VND/đêm)' },
          max_price: { type: 'NUMBER', description: 'Giá tối đa (VND/đêm)' },
          guests:    { type: 'NUMBER', description: 'Số khách' },
          amenities: { type: 'STRING', description: 'Tiện ích, phân cách bằng dấu phẩy' },
          check_in:  { type: 'STRING', description: 'Ngày nhận phòng (YYYY-MM-DD)' },
          check_out: { type: 'STRING', description: 'Ngày trả phòng (YYYY-MM-DD)' },
        },
      },
    },
    {
      name: 'get_hotel_detail',
      description: 'Lấy chi tiết khách sạn theo ID.',
      parameters: {
        type: 'OBJECT',
        properties: { hotel_id: { type: 'NUMBER', description: 'ID khách sạn' } },
        required: ['hotel_id'],
      },
    },
    {
      name: 'create_booking',
      description: 'Đặt phòng. Chỉ gọi khi khách xác nhận và có đủ thông tin.',
      parameters: {
        type: 'OBJECT',
        properties: {
          room_type_id:   { type: 'NUMBER', description: 'ID loại phòng' },
          check_in:       { type: 'STRING', description: 'Ngày nhận phòng (YYYY-MM-DD)' },
          check_out:      { type: 'STRING', description: 'Ngày trả phòng (YYYY-MM-DD)' },
          payment_method: { type: 'STRING', description: 'online hoặc pay_at_hotel', enum: ['online', 'pay_at_hotel'] },
        },
        required: ['room_type_id', 'check_in', 'check_out'],
      },
    },
    {
      name: 'get_nearby_services',
      description: 'Lấy dịch vụ/địa điểm lân cận khách sạn. Dùng sau khi đặt phòng hoặc khi khách hỏi về ăn uống, tham quan, spa, di chuyển, nightlife.',
      parameters: {
        type: 'OBJECT',
        properties: {
          hotel_id: { type: 'NUMBER', description: 'ID khách sạn' },
          category: { type: 'STRING', description: 'Loại dịch vụ: food, attraction, wellness, transport, nightlife', enum: ['food', 'attraction', 'wellness', 'transport', 'nightlife'] },
        },
        required: ['hotel_id'],
      },
    },
  ],
}];

// ── Rate Limit ────────────────────────────────────────────────────────────────
const MIN_GAP_MS = 1000; // 1s giữa các request cùng key (8 key = ~8 RPM/key)
const keyLastUsed = new Map(); // key index → timestamp

async function throttle() {
  const lastUsed = keyLastUsed.get(currentKeyIndex) || 0;
  const wait = MIN_GAP_MS - (Date.now() - lastUsed);
  if (wait > 0) {
    await new Promise(r => setTimeout(r, wait));
  }
  keyLastUsed.set(currentKeyIndex, Date.now());
}

// ── Gọi Gemini API ──────────────────────────────────────────────────────────
async function callGemini(contents, retryCount = 0) {
  await throttle();

  let res;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    res = await fetch(getGeminiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        tools: TOOLS,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
      }),
    });

    clearTimeout(timeout);
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    log.error('Gemini request failed', { error: isTimeout ? 'timeout (30s)' : err.message });
    // Network/timeout error → thử key khác
    if (retryCount < 2 && rotateKey()) {
      await new Promise(r => setTimeout(r, 1000));
      return callGemini(contents, retryCount + 1);
    }
    return null;
  }

  // Rate limit hoặc quota hết → rotate key
  if ((res.status === 429 || res.status === 403) && retryCount < GEMINI_KEYS.length) {
    const rotated = rotateKey();
    if (rotated) {
      log.warn('Key exhausted, trying next key', { status: res.status, keyIndex: currentKeyIndex });
      await new Promise(r => setTimeout(r, 1000));
      return callGemini(contents, retryCount + 1);
    }
    // Chỉ có 1 key → chờ lâu hơn rồi retry 1 lần
    if (retryCount === 0) {
      log.warn('Single key exhausted, waiting 10s...');
      await new Promise(r => setTimeout(r, 10000));
      return callGemini(contents, retryCount + 1);
    }
    return null;
  }

  if (!res.ok) {
    const errText = await res.text();
    log.error('Gemini API error', { status: res.status, body: errText.substring(0, 200) });
    return null;
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content || null;
}

// ── Thực thi Tool ────────────────────────────────────────────────────────────
async function executeToolCall(functionCall, { userId, model }) {
  const { name, args } = functionCall;
  log.info('Executing tool', { name, args });

  try {
    if (name === 'search_rooms') {
      const rooms = await model.searchRooms({
        city: args.city || null,
        min_price: args.min_price || null,
        max_price: args.max_price || null,
        guests: args.guests || null,
        amenities: args.amenities ? args.amenities.split(',').map(a => a.trim()) : null,
        check_in: args.check_in || null,
        check_out: args.check_out || null,
      });
      return { rooms };
    }

    if (name === 'get_hotel_detail') {
      const hotelModel = require('../hotel/hotel.model');
      const hotel = await hotelModel.getHotelDetailById(args.hotel_id);
      return hotel ? { hotel } : { error: 'Không tìm thấy khách sạn' };
    }

    if (name === 'create_booking') {
      if (!userId) return { error: 'Bạn cần đăng nhập để đặt phòng.' };
      const bookingService = require('../booking/booking.service');
      try {
        const booking = await bookingService.createBooking({
          userId,
          roomTypeId: args.room_type_id,
          checkIn: args.check_in,
          checkOut: args.check_out,
          paymentMethod: args.payment_method || 'pay_at_hotel',
        });
        return { booking: { id: booking.id, status: booking.status } };
      } catch (bookingErr) {
        const safeMsg = bookingErr.status && bookingErr.status < 500
          ? bookingErr.message
          : 'Không thể đặt phòng lúc này. Vui lòng thử lại sau.';
        return { error: safeMsg };
      }
    }

    if (name === 'get_nearby_services') {
      const nearbyModel = require('../hotel/nearby-service.model');
      try {
        const services = await nearbyModel.getNearbyServices({
          hotelId: args.hotel_id,
          category: args.category || null,
          limit: 5,
        });
        if (!services || services.length === 0) {
          return { services: [], message: 'Không tìm thấy dịch vụ lân cận cho khách sạn này.' };
        }
        return { services: services.map(s => ({
          name: s.name,
          category: s.category,
          description: s.description,
          address: s.address,
          distance: s.distance,
          rating: s.rating,
          price_range: s.price_range,
          map_url: s.map_url,
          tags: s.tags,
        })) };
      } catch (err) {
        return { services: [], message: 'Không thể lấy thông tin dịch vụ lân cận.' };
      }
    }

    return { error: `Unknown tool: ${name}` };
  } catch (err) {
    log.error('Tool failed', { name, error: err.message });
    return { error: err.message };
  }
}

// ── Chat chính ───────────────────────────────────────────────────────────────

/**
 * Chat với Gemini, hỗ trợ function calling loop.
 *
 * @param {string} userMessage - Tin nhắn user
 * @param {Array} previousContents - Lịch sử chat (Gemini format)
 * @param {object} context - { userId, model (ai.model) }
 * @returns {{ reply, rooms, booking, geminiContents }} hoặc null nếu LLM tắt
 */
async function chat(userMessage, previousContents, context) {
  if (!isEnabled()) return null;

  // Ghép lịch sử cũ + tin nhắn mới
  const contents = [...previousContents, { role: 'user', parts: [{ text: userMessage }] }];

  let collectedRooms = [];
  let bookingResult = null;

  // Vòng lặp tool calling: Gemini có thể gọi tool nhiều lần trước khi trả lời text
  for (let round = 0; round < 3; round++) {
    const response = await callGemini(contents);

    // Nếu Gemini fail nhưng đã có booking → trả kết quả luôn, không cần Gemini format
    if (!response && bookingResult) {
      return {
        reply: 'Đặt phòng thành công! Chúc bạn có chuyến đi vui vẻ 🎉',
        rooms: collectedRooms,
        booking: bookingResult,
        geminiContents: contents,
      };
    }
    if (!response) return null;

    // Gemini trả text → xong
    const toolCall = response.parts?.find(p => p.functionCall);
    if (!toolCall) {
      const reply = response.parts?.find(p => p.text)?.text?.trim() || 'Xin lỗi, tôi không hiểu.';
      contents.push({ role: 'model', parts: [{ text: reply }] });
      return { reply, rooms: collectedRooms, booking: bookingResult, geminiContents: contents };
    }

    // Gemini muốn gọi tool → thực thi → gửi kết quả lại
    const toolResult = await executeToolCall(toolCall.functionCall, context);
    if (toolResult.rooms) collectedRooms = toolResult.rooms;
    if (toolResult.booking) bookingResult = toolResult.booking;

    contents.push({ role: 'model', parts: [{ functionCall: toolCall.functionCall }] });
    contents.push({ role: 'user', parts: [{ functionResponse: { name: toolCall.functionCall.name, response: toolResult } }] });
  }

  return { reply: 'Xin lỗi, tôi gặp sự cố. Bạn thử lại nhé!', rooms: collectedRooms, booking: bookingResult, geminiContents: contents };
}

module.exports = { isEnabled, chat };
