const { Router } = require('express');
const chatbotController = require('./chatbot.controller');

const router = Router();

router.post('/chat', chatbotController.chat);

module.exports = router;
