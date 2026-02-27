const { Router } = require('express');
const aiController = require('./ai.controller');
const chatbotRoutes = require('./chatbot.route');
const recommendationRoutes = require('./recommendation.route');
const chatAdvancedRoutes = require('./chatAdvanced.route');

const router = Router();

router.get('/status', aiController.getAiStatus);
router.use('/', chatbotRoutes);
router.use('/', recommendationRoutes);
router.use('/', chatAdvancedRoutes);

module.exports = router;
