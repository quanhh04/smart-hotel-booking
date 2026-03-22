const jwt = require('jsonwebtoken');
const analyticsService = require('./analytics.service');

const getUserIdFromAuthHeader = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || decoded.user_id || null;
  } catch (error) {
    const authError = new Error('Bạn chưa đăng nhập');
    authError.status = 401;
    throw authError;
  }
};

const trackClick = async (req, res) => {
  try {
    const { room_type_id: roomTypeId } = req.body;

    if (!Number.isInteger(roomTypeId) || roomTypeId <= 0) {
      return res.status(400).json({ message: 'room_type_id phải là số nguyên dương' });
    }

    const userId = getUserIdFromAuthHeader(req.headers.authorization);
    const click = await analyticsService.trackRoomClick({ roomTypeId, userId });

    return res.status(201).json(click);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await analyticsService.getStats();
    return res.status(200).json(stats);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  trackClick,
  getStats,
};
