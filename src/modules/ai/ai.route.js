const { Router } = require('express');
const validate = require('../../common/middleware/validate');
const authMiddleware = require('../../common/middleware/auth.middleware');
const optionalAuth = require('../../common/middleware/optional-auth');
const controller = require('./ai.controller');
const schema = require('./ai.schema');

const router = Router();

router.post('/chat', optionalAuth, validate(schema.chat), controller.chat);
router.get('/recommendations', validate(schema.recommendations), controller.getRecommendations);
router.get('/trending', validate(schema.trending), controller.getTrending);
router.get('/history-based', authMiddleware, validate(schema.historyBased), controller.getHistoryBased);
router.post('/track/click', authMiddleware, validate(schema.trackClick), controller.trackClick);
router.get('/stats', validate(schema.stats), controller.getStats);
router.get('/status', controller.getStatus);

module.exports = router;
