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
    const authError = new Error('Unauthorized');
    authError.status = 401;
    throw authError;
  }
};

const trackClick = async (req, res) => {
  try {
    const { room_id: roomId } = req.body;

    if (!Number.isInteger(roomId) || roomId <= 0) {
      return res.status(400).json({ message: 'room_id must be a positive integer' });
    }

    const userId = getUserIdFromAuthHeader(req.headers.authorization);
    const click = await analyticsService.trackRoomClick({ roomId, userId });

    return res.status(201).json(click);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await analyticsService.getStats();
    return res.status(200).json(stats);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  trackClick,
  getStats,
};
