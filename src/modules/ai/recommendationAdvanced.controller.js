const recommendationAdvancedService = require('./recommendationAdvanced.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getAdvancedRecommendations = asyncHandler(async (req, res) => {
  const guests = req.query.guests !== undefined ? Number(req.query.guests) : undefined;
  const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined;
  const limit = req.query.limit !== undefined ? Number(req.query.limit) : 5;
  const amenities = req.query.amenities;

  if (req.query.guests !== undefined && (!Number.isInteger(guests) || guests <= 0)) {
    return res.status(400).json({ message: 'Số khách phải là số nguyên dương' });
  }

  if (req.query.maxPrice !== undefined && (Number.isNaN(maxPrice) || maxPrice <= 0)) {
    return res.status(400).json({ message: 'Giá tối đa phải là số dương' });
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    return res.status(400).json({ message: 'Giới hạn kết quả phải là số nguyên dương' });
  }

  const recommendations = await recommendationAdvancedService.getAdvancedRecommendations({
    guests,
    maxPrice,
    amenities,
    limit,
  });

  return res.status(200).json(recommendations);
});

module.exports = { getAdvancedRecommendations };
