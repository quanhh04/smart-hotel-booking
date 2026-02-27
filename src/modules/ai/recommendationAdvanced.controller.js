const recommendationAdvancedService = require('./recommendationAdvanced.service');

const getAdvancedRecommendations = async (req, res) => {
  try {
    const guests = req.query.guests !== undefined ? Number(req.query.guests) : undefined;
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 5;
    const amenities = req.query.amenities;

    if (req.query.guests !== undefined && (!Number.isInteger(guests) || guests <= 0)) {
      return res.status(400).json({ message: 'guests must be a positive integer' });
    }

    if (req.query.maxPrice !== undefined && (Number.isNaN(maxPrice) || maxPrice <= 0)) {
      return res.status(400).json({ message: 'maxPrice must be a positive number' });
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).json({ message: 'limit must be a positive integer' });
    }

    const recommendations = await recommendationAdvancedService.getAdvancedRecommendations({
      guests,
      maxPrice,
      amenities,
      limit,
    });

    return res.status(200).json(recommendations);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAdvancedRecommendations,
};
