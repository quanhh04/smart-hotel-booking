const { Router } = require('express');
const authMiddleware = require('../../common/middleware/auth.middleware');
const optionalAuth = require('../../common/middleware/optional-auth');
const controller = require('./ai.controller');
const { validateChat, validateRecommendations, validateTrending, validateTrackClick, validateStats } = require('./ai.validate');

const router = Router();

router.post('/chat', optionalAuth, validateChat, controller.chat);
router.get('/recommendations', validateRecommendations, controller.getRecommendations);
router.get('/trending', validateTrending, controller.getTrending);
router.get('/history-based', authMiddleware, controller.getHistoryBased);
router.post('/track/click', authMiddleware, validateTrackClick, controller.trackClick);
router.get('/stats', validateStats, controller.getStats);
router.get('/status', controller.getStatus);

module.exports = router;
