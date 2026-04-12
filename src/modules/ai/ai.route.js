const { Router } = require('express');
const optionalAuth = require('../../common/middleware/optional-auth');
const controller = require('./ai.controller');
const { validateChat, validateRecommendations } = require('./ai.validate');

const router = Router();

router.post('/chat', optionalAuth, validateChat, controller.chat);
router.get('/recommendations', validateRecommendations, controller.getRecommendations);

module.exports = router;
