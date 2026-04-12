const { sendError } = require('../../common/middleware/validate');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

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

/**
 * GET /ai/trending
 * Query: { days? }
 */
const validateTrending = (req, res, next) => {
  const { days } = req.query;

  if (days !== undefined) {
    const d = Number(days);
    if (isNaN(d) || d < 7 || d > 30) return sendError(res, 'Số ngày phải từ 7 đến 30');
  }

  next();
};

/**
 * POST /ai/track/click
 * Body: { room_type_id }
 */
const validateTrackClick = (req, res, next) => {
  const { room_type_id } = req.body;
  if (!room_type_id) return sendError(res, 'Room type ID là bắt buộc');
  if (!Number.isInteger(Number(room_type_id)) || Number(room_type_id) <= 0) {
    return sendError(res, 'Room type ID phải là số nguyên dương');
  }
  next();
};

/**
 * GET /ai/stats
 * Query: { from?, to? }
 */
const validateStats = (req, res, next) => {
  const { from, to } = req.query;

  if (from !== undefined && (!ISO_DATE_RE.test(from) || isNaN(Date.parse(from)))) {
    return sendError(res, 'Ngày bắt đầu phải đúng định dạng ISO 8601');
  }
  if (to !== undefined && (!ISO_DATE_RE.test(to) || isNaN(Date.parse(to)))) {
    return sendError(res, 'Ngày kết thúc phải đúng định dạng ISO 8601');
  }

  next();
};

module.exports = { validateChat, validateRecommendations, validateTrending, validateTrackClick, validateStats };
