const { Router } = require('express');
const recommendationController = require('./recommendation.controller');

const router = Router();

router.get('/recommendations', recommendationController.getRecommendations);

module.exports = router;
