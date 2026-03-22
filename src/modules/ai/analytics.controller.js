const jwt = require('jsonwebtoken');
const analyticsService = require('./analytics.service');
const { asyncHandler } = require('../../common/helpers/controller');
const { createError } = require('../../common/helpers/error');

const getUserIdFromAuthHeader = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.user_id || null;
  } catch {
    throw createError('Bạn chưa đăng nhập', 401);
  }
};

const trackClick = asyncHandler(async (req, res) => {
  const { room_type_id: roomTypeId } = req.body;

  if (!Number.isInteger(roomTypeId) || roomTypeId <= 0) {
    return res.status(400).json({ message: 'room_type_id phải là số nguyên dương' });
  }

  const userId = getUserIdFromAuthHeader(req.headers.authorization);
  const click = await analyticsService.trackRoomClick({ roomTypeId, userId });
  return res.status(201).json(click);
});

const getStats = asyncHandler(async (_req, res) => {
  const stats = await analyticsService.getStats();
  return res.status(200).json(stats);
});

module.exports = { trackClick, getStats };
