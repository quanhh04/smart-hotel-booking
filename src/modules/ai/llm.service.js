/**
 * LLM Service - Google Gemini integration
 * Fallback to rule-based if no API key or API fails
 */
const createLogger = require('../../common/helpers/logger');
const log = createLogger('llm.service');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

function isEnabled() {
  return !!GEMINI_API_KEY;
}

function buildSystemPrompt(rooms, slots, conversationHistory) {
  const roomContext = rooms.length > 0
    ? `\n\nKết quả tìm kiếm phòng (${rooms.length} phòng):\n` +
      rooms.slice(0, 5).map((r, i) =>
        `${i + 1}. ${r.room_name} - ${r.hotel_name} (${r.hotel_address})\n` +
        `   Giá: ${Number(r.price_per_night).toLocaleString('vi-VN')} ₫/đêm | Tối đa: ${r.max_guests} khách\n` +
        `   Tiện ích: ${(r.amenities || []).join(', ')}`
      ).join('\n')
    : '';

  const slotContext = Object.entries(slots || {})
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const historyText = (conversationHistory || [])
    .slice(-6)
    .map(h => `${h.role === 'user' ? 'Khách' : 'Trợ lý'}: ${h.content}`)
    .join('\n');

  return `Bạn là trợ lý đặt phòng khách sạn thông minh của BookingVN. Trả lời bằng tiếng Việt, thân thiện, ngắn gọn.

Quy tắc:
- Trả lời tự nhiên, không robot
- Nếu có kết quả phòng, giới thiệu ngắn gọn và gợi ý đặt phòng
- Nếu không có kết quả, gợi ý thay đổi tiêu chí
- Giá hiển thị dạng VND (VD: 2.200.000 ₫)
- Không bịa thông tin phòng/khách sạn ngoài dữ liệu được cung cấp
- Có thể trả lời câu hỏi chung về du lịch Việt Nam
- QUAN TRỌNG: Khi khách muốn đặt phòng (nói "đặt", "book", "ok đặt", "đặt hộ", "đặt phòng này"), bạn PHẢI trả về CHÍNH XÁC format JSON sau ở DÒNG ĐẦU TIÊN, sau đó mới viết message:
  {"action":"book","room_type_id":<số>,"check_in":"YYYY-MM-DD","check_out":"YYYY-MM-DD","payment_method":"pay_at_hotel"}
- Chỉ trả action book khi có đủ: room_type_id (từ kết quả tìm kiếm), check_in, check_out
- Nếu thiếu thông tin, HỎI khách thay vì đặt
- KHÔNG BAO GIỜ bịa rằng đã đặt phòng thành công nếu chưa có action book
${slotContext ? `\nThông tin khách đã cung cấp: ${slotContext}` : ''}
${roomContext}
${historyText ? `\nLịch sử hội thoại:\n${historyText}` : ''}`;
}

async function generateResponse(userMessage, rooms, slots, conversationHistory) {
  if (!isEnabled()) {
    return null; // fallback to rule-based
  }

  try {
    const systemPrompt = buildSystemPrompt(rooms, slots, conversationHistory);

    const body = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nKhách: ' + userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9,
      },
    };

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Retry once on rate limit (429)
    if (res.status === 429) {
      log.warn('LLM rate limited, retrying in 2s...');
      await new Promise(r => setTimeout(r, 2000));
      const retry = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!retry.ok) {
        log.error('LLM retry also failed', { status: retry.status });
        return null;
      }
      const retryData = await retry.json();
      const retryText = retryData?.candidates?.[0]?.content?.parts?.[0]?.text;
      return retryText ? retryText.trim() : null;
    }

    if (!res.ok) {
      const errText = await res.text();
      log.error('LLM API error', { status: res.status, body: errText });
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      log.warn('LLM returned empty response');
      return null;
    }

    log.info('LLM response generated', { length: text.length });
    return text.trim();
  } catch (err) {
    log.error('LLM call failed', { error: err.message });
    return null;
  }
}

/**
 * Parse action JSON from LLM response (first line)
 * Returns { action, params, cleanReply } or null
 */
function parseAction(reply) {
  if (!reply) return null;
  const lines = reply.split('\n');
  const firstLine = lines[0].trim();

  // Try to extract JSON from first line
  const jsonMatch = firstLine.match(/^\{.*\}$/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.action) {
      return {
        action: parsed.action,
        params: parsed,
        cleanReply: lines.slice(1).join('\n').trim(),
      };
    }
  } catch {
    // Not valid JSON, ignore
  }
  return null;
}

module.exports = { isEnabled, generateResponse, parseAction };
