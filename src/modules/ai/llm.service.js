/**
 * LLM Service - Google Gemini with Function Calling
 * Gemini handles all chat logic: intent detection, room search, booking
 * Fallback to rule-based only when Gemini is unavailable
 */
const createLogger = require('../../common/helpers/logger');
const log = createLogger('llm.service');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

function isEnabled() { return !!GEMINI_API_KEY; }

if (GEMINI_API_KEY) {
  log.info('LLM enabled', { model: GEMINI_MODEL, keyPrefix: GEMINI_API_KEY.substring(0, 8) + '...' });
} else {
  log.warn('LLM disabled: GEMINI_API_KEY not set — chatbot uses rule-based fallback');
}

// ========== SYSTEM PROMPT ==========
const SYSTEM_PROMPT = `Bạn là trợ lý đặt phòng khách sạn thông minh của BookingVN. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn.

Bạn có các công cụ (tools) để:
1. search_rooms: Tìm phòng khách sạn theo tiêu chí (thành phố, giá, số khách, tiện ích, ngày)
2. get_hotel_detail: Xem chi tiết khách sạn theo ID
3. create_booking: Đặt phòng cho khách (cần room_type_id, check_in, check_out)

QUY TẮC BẮT BUỘC:
- LUÔN LUÔN gọi search_rooms TRƯỚC khi đặt phòng, kể cả khi khách đã nêu tên phòng/khách sạn cụ thể. Bạn cần room_id từ kết quả search để dùng làm room_type_id cho create_booking.
- KHÔNG BAO GIỜ hỏi khách về mã ID, room_type_id, hay bất kỳ mã số nào. Tự lấy từ kết quả search_rooms.
- KHÔNG BAO GIỜ bịa data — chỉ dùng data từ kết quả tools.
- Khi khách muốn đặt phòng và bạn chưa có room_id → gọi search_rooms với tên khách sạn/phòng làm keyword → lấy room_id từ kết quả → gọi create_booking.
- Nếu search_rooms không tìm thấy phòng khách yêu cầu → thông báo không tìm thấy, gợi ý phòng khác.
- Nếu thiếu thông tin (ngày check-in/check-out) → HỎI khách trước, KHÔNG đoán.
- Giá hiển thị dạng VND (VD: 2.200.000 ₫/đêm).
- Trả lời tự nhiên, có thể trả lời câu hỏi chung về du lịch Việt Nam.

QUY TRÌNH ĐẶT PHÒNG:
1. Khách yêu cầu đặt phòng → gọi search_rooms (dùng tên khách sạn/thành phố/tiêu chí)
2. Từ kết quả search → tìm phòng khớp → lấy room_id
3. Xác nhận với khách (tên phòng, giá, ngày)
4. Gọi create_booking với room_type_id = room_id từ bước 2`;

// ========== TOOL DEFINITIONS ==========
const TOOLS = [{
  functionDeclarations: [
    {
      name: 'search_rooms',
      description: 'Tìm kiếm phòng khách sạn theo tiêu chí. LUÔN gọi tool này trước khi đặt phòng để lấy room_id. Có thể tìm theo tên khách sạn bằng cách truyền tên vào field city. Trả về danh sách phòng với room_id (dùng làm room_type_id khi đặt phòng), tên phòng, khách sạn, giá, tiện ích.',
      parameters: {
        type: 'OBJECT',
        properties: {
          city: { type: 'STRING', description: 'Tên thành phố (VD: Đà Nẵng, Hà Nội)' },
          min_price: { type: 'NUMBER', description: 'Giá tối thiểu (VND/đêm)' },
          max_price: { type: 'NUMBER', description: 'Giá tối đa (VND/đêm)' },
          guests: { type: 'NUMBER', description: 'Số khách' },
          amenities: { type: 'STRING', description: 'Tiện ích cần có, phân cách bằng dấu phẩy' },
          check_in: { type: 'STRING', description: 'Ngày nhận phòng (YYYY-MM-DD)' },
          check_out: { type: 'STRING', description: 'Ngày trả phòng (YYYY-MM-DD)' },
        },
      },
    },
    {
      name: 'get_hotel_detail',
      description: 'Lấy thông tin chi tiết của một khách sạn theo ID.',
      parameters: {
        type: 'OBJECT',
        properties: {
          hotel_id: { type: 'NUMBER', description: 'ID khách sạn' },
        },
        required: ['hotel_id'],
      },
    },
    {
      name: 'create_booking',
      description: 'Đặt phòng khách sạn cho khách. Chỉ gọi khi khách xác nhận muốn đặt và có đủ thông tin.',
      parameters: {
        type: 'OBJECT',
        properties: {
          room_type_id: { type: 'NUMBER', description: 'ID loại phòng muốn đặt' },
          check_in: { type: 'STRING', description: 'Ngày nhận phòng (YYYY-MM-DD)' },
          check_out: { type: 'STRING', description: 'Ngày trả phòng (YYYY-MM-DD)' },
          payment_method: { type: 'STRING', description: 'Phương thức thanh toán: online hoặc pay_at_hotel', enum: ['online', 'pay_at_hotel'] },
        },
        required: ['room_type_id', 'check_in', 'check_out'],
      },
    },
  ],
}];

// ========== RATE LIMIT THROTTLE ==========
// Gemini 2.5 Flash free: 5 RPM, 20 RPD — need spacing between requests
let lastRequestTime = 0;
const MIN_REQUEST_GAP_MS = 15000; // 15s gap = max 4 per minute (safe under 5 RPM limit)

async function throttle() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    const wait = MIN_REQUEST_GAP_MS - elapsed;
    log.info('LLM throttling', { waitMs: wait });
    await new Promise(r => setTimeout(r, wait));
  }
  lastRequestTime = Date.now();
}

// ========== GEMINI API CALL ==========
async function callGemini(contents, retryCount = 0) {
  await throttle();

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    tools: TOOLS,
    generationConfig: { temperature: 0.7, maxOutputTokens: 800, topP: 0.9 },
  };

  const startTime = Date.now();
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const elapsed = Date.now() - startTime;

  if (res.status === 429 && retryCount < 1) {
    log.warn('LLM rate limited (429), retrying in 15s...', { elapsed });
    await new Promise(r => setTimeout(r, 15000));
    return callGemini(contents, retryCount + 1);
  }

  if (!res.ok) {
    const errText = await res.text();
    log.error('LLM API error', { status: res.status, elapsed, body: errText.substring(0, 300) });
    return null;
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const tokens = data?.usageMetadata?.totalTokenCount;
  log.info('LLM response', { elapsed, finishReason: candidate?.finishReason, tokens: tokens || 'N/A' });
  return candidate?.content || null;
}

// ========== TOOL EXECUTORS ==========
async function executeToolCall(functionCall, { userId, model }) {
  const { name, args } = functionCall;
  log.info('Executing tool', { name, args });

  try {
    switch (name) {
      case 'search_rooms': {
        const rooms = await model.searchRooms({
          city: args.city || null,
          min_price: args.min_price || null,
          max_price: args.max_price || null,
          guests: args.guests || null,
          amenities: args.amenities ? args.amenities.split(',').map(a => a.trim()) : null,
          check_in: args.check_in || null,
          check_out: args.check_out || null,
        });
        log.info('search_rooms result', { count: rooms.length });
        return { rooms };
      }

      case 'get_hotel_detail': {
        const hotelModel = require('../hotel/hotel.model');
        const hotel = await hotelModel.getHotelDetailById(args.hotel_id);
        return hotel ? { hotel } : { error: 'Không tìm thấy khách sạn' };
      }

      case 'create_booking': {
        if (!userId) {
          return { error: 'Khách chưa đăng nhập. Vui lòng yêu cầu khách đăng nhập trước khi đặt phòng.' };
        }
        const bookingService = require('../booking/booking.service');
        const booking = await bookingService.createBooking({
          userId,
          roomTypeId: args.room_type_id,
          checkIn: args.check_in,
          checkOut: args.check_out,
          paymentMethod: args.payment_method || 'pay_at_hotel',
        });
        log.info('create_booking success', { bookingId: booking.id });
        return { booking: { id: booking.id, status: booking.status } };
      }

      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    log.error('Tool execution failed', { name, error: err.message });
    return { error: err.message };
  }
}

// ========== MAIN CHAT FUNCTION ==========
/**
 * Full Gemini-powered chat with function calling loop.
 * @param {string} userMessage
 * @param {Array} previousContents - Gemini API format contents from previous turns
 * @param {object} context - { userId, model (ai.model) }
 * @returns {{ reply: string, rooms: Array, booking: object|null, geminiContents: Array }} or null if LLM unavailable
 */
async function chat(userMessage, previousContents, context) {
  if (!isEnabled()) {
    log.warn('LLM skipped: not enabled');
    return null;
  }

  log.info('LLM chat starting', { messageLength: userMessage.length, historyLength: previousContents.length });

  // Build contents: previous Gemini contents + new user message
  const contents = [...previousContents];
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  let collectedRooms = [];
  let bookingResult = null;
  const MAX_TOOL_ROUNDS = 3;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const responseContent = await callGemini(contents);
    if (!responseContent) return null;

    // Check if Gemini wants to call a tool
    const functionCallPart = responseContent.parts?.find(p => p.functionCall);
    if (!functionCallPart) {
      // No tool call — extract text reply
      const textPart = responseContent.parts?.find(p => p.text);
      const reply = textPart?.text?.trim() || 'Xin lỗi, tôi không hiểu. Bạn thử hỏi lại nhé!';
      // Thêm model response vào contents để lưu history
      contents.push({ role: 'model', parts: [{ text: reply }] });
      log.info('LLM chat done', { rounds: round + 1, roomCount: collectedRooms.length, hasBooking: !!bookingResult });
      return { reply, rooms: collectedRooms, booking: bookingResult, geminiContents: contents };
    }

    // Execute the tool
    const toolResult = await executeToolCall(functionCallPart.functionCall, context);

    // Collect rooms/booking from tool results
    if (toolResult.rooms) collectedRooms = toolResult.rooms;
    if (toolResult.booking) bookingResult = toolResult.booking;

    // Feed tool result back to Gemini
    contents.push({ role: 'model', parts: [{ functionCall: functionCallPart.functionCall }] });
    contents.push({
      role: 'user',
      parts: [{ functionResponse: { name: functionCallPart.functionCall.name, response: toolResult } }],
    });
  }

  log.warn('LLM chat exceeded max tool rounds');
  return { reply: 'Xin lỗi, tôi gặp sự cố khi xử lý. Bạn thử lại nhé!', rooms: collectedRooms, booking: bookingResult, geminiContents: contents };
}

module.exports = { isEnabled, chat, callGemini };
