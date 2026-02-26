const { Router } = require('express');
const aiController = require('./ai.controller');
const chatbotRoutes = require('./chatbot.route');

const router = Router();

router.get('/status', aiController.getAiStatus);
router.use('/', chatbotRoutes);

module.exports = router;
