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
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

function isEnabled() { return !!GEMINI_API_KEY; }

if (GEMINI_API_KEY) {
  log.info('LLM enabled', { model: GEMINI_MODEL });
} else {
  log.warn('LLM disabled: GEMINI_API_KEY not set');
}

// ── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Bạn là trợ lý đặt phòng khách sạn thông minh của BookingVN. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn.

Bạn có các công cụ (tools) để:
1. search_rooms: Tìm phòng khách sạn theo tiêu chí
2. get_hotel_detail: Xem chi tiết khách sạn theo ID
3. create_booking: Đặt phòng cho khách

QUY TẮC:
- LUÔN gọi search_rooms TRƯỚC khi đặt phòng để lấy room_id.
- KHÔNG hỏi khách về mã ID. Tự lấy từ kết quả search_rooms.
- KHÔNG bịa data — chỉ dùng data từ kết quả tools.
- Nếu thiếu ngày check-in/check-out → HỎI khách trước.
- Giá hiển thị dạng VND (VD: 2.200.000 ₫/đêm).`;

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
  ],
}];

// ── Rate Limit (Gemini free tier: 10 RPM) ────────────────────────────────────
let lastRequestTime = 0;
const MIN_GAP_MS = 15000; // 15s giữa các request

async function throttle() {
  const wait = MIN_GAP_MS - (Date.now() - lastRequestTime);
  if (wait > 0) {
    log.info('Throttling', { waitMs: wait });
    await new Promise(r => setTimeout(r, wait));
  }
  lastRequestTime = Date.now();
}

// ── Gọi Gemini API ──────────────────────────────────────────────────────────
async function callGemini(contents, retryCount = 0) {
  await throttle();

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      tools: TOOLS,
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
    }),
  });

  // Retry 1 lần nếu bị rate limit
  if (res.status === 429 && retryCount < 1) {
    log.warn('Rate limited (429), retrying...');
    await new Promise(r => setTimeout(r, 15000));
    return callGemini(contents, retryCount + 1);
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
      if (!userId) return { error: 'Khách chưa đăng nhập.' };
      const bookingService = require('../booking/booking.service');
      const booking = await bookingService.createBooking({
        userId,
        roomTypeId: args.room_type_id,
        checkIn: args.check_in,
        checkOut: args.check_out,
        paymentMethod: args.payment_method || 'pay_at_hotel',
      });
      return { booking: { id: booking.id, status: booking.status } };
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
