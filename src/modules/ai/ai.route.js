const { Router } = require('express');
const aiController = require('./ai.controller');

const router = Router();

router.get('/status', aiController.getAiStatus);

module.exports = router;
