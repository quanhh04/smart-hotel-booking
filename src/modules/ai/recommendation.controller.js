const recommendationService = require('./recommendation.service');

const getRecommendations = async (req, res) => {
  try {
    const guests = Number(req.query.guests);
    const maxPrice = Number(req.query.maxPrice);

    if (!Number.isInteger(guests) || guests <= 0) {
      return res.status(400).json({ message: 'guests must be a positive integer' });
    }

    if (Number.isNaN(maxPrice) || maxPrice <= 0) {
      return res.status(400).json({ message: 'maxPrice must be a positive number' });
    }

    const recommendations = await recommendationService.getRecommendations({
      guests,
      maxPrice,
    });

    return res.status(200).json(recommendations);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRecommendations,
};
