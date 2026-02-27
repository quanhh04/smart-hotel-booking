const { Router } = require('express');
const analyticsController = require('./analytics.controller');

const router = Router();

router.post('/track/click', analyticsController.trackClick);
router.get('/stats', analyticsController.getStats);

module.exports = router;
