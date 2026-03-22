const recommendationService = require('./recommendation.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getRecommendations = asyncHandler(async (req, res) => {
  const guests = Number(req.query.guests);
  const maxPrice = Number(req.query.maxPrice);

  if (!Number.isInteger(guests) || guests <= 0) {
    return res.status(400).json({ message: 'Số khách phải là số nguyên dương' });
  }

  if (Number.isNaN(maxPrice) || maxPrice <= 0) {
    return res.status(400).json({ message: 'Giá tối đa phải là số dương' });
  }

  const recommendations = await recommendationService.getRecommendations({ guests, maxPrice });
  return res.status(200).json(recommendations);
});

module.exports = { getRecommendations };
