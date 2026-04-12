const { sendError } = require('../../common/middleware/validate');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /ai/chat
 * Body: { message, session_id? }
 */
const validateChat = (req, res, next) => {
  const { message, session_id } = req.body;

  if (!message) return sendError(res, 'Tin nhắn là bắt buộc');
  if (typeof message !== 'string') return sendError(res, 'Tin nhắn phải là chuỗi ký tự');
  if (message.length < 1) return sendError(res, 'Tin nhắn không được rỗng');
  if (message.length > 1000) return sendError(res, 'Tin nhắn không được vượt quá 1000 ký tự');

  if (session_id !== undefined) {
    if (typeof session_id !== 'string') return sendError(res, 'Session ID phải là chuỗi ký tự');
    if (!UUID_RE.test(session_id)) return sendError(res, 'Session ID phải đúng định dạng UUID');
  }

  next();
};

/**
 * GET /ai/recommendations
 * Query: { guests?, max_price?, amenities?, limit? }
 */
const validateRecommendations = (req, res, next) => {
  const { guests, max_price, limit } = req.query;

  if (guests !== undefined && (!Number.isInteger(Number(guests)) || Number(guests) <= 0)) {
    return sendError(res, 'Số khách phải là số nguyên dương');
  }
  if (max_price !== undefined && (isNaN(Number(max_price)) || Number(max_price) < 0)) {
    return sendError(res, 'Giá tối đa phải là số >= 0');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1) return sendError(res, 'Giới hạn phải là số nguyên >= 1');
    if (l > 20) return sendError(res, 'Giới hạn không được vượt quá 20');
  }

  next();
};

module.exports = { validateChat, validateRecommendations };
