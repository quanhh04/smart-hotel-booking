const { Router } = require('express');
const chatAdvancedController = require('./chatAdvanced.controller');

const router = Router();

router.post('/chat-advanced', chatAdvancedController.chatAdvanced);

module.exports = router;
