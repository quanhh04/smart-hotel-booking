const { Router } = require('express');
const recommendationAdvancedController = require('./recommendationAdvanced.controller');

const router = Router();

router.get('/recommendations-advanced', recommendationAdvancedController.getAdvancedRecommendations);

module.exports = router;
