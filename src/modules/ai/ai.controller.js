const { asyncHandler } = require('../../common/helpers/controller');
const service = require('./ai.service');

const chat = asyncHandler(async (req, res) => {
  const { message, session_id } = req.body;
  const user_id = req.user ? req.user.userId : null;
  const result = await service.chat(message, session_id, user_id);
  return res.status(200).json(result);
});

const getRecommendations = asyncHandler(async (req, res) => {
  const { guests, max_price, amenities, limit } = req.query;
  const result = await service.getRecommendations({
    guests: guests != null ? Number(guests) : undefined,
    max_price: max_price != null ? Number(max_price) : undefined,
    amenities: amenities || undefined,
    limit: limit != null ? Number(limit) : undefined,
  });
  return res.status(200).json(result);
});

module.exports = { chat, getRecommendations };
