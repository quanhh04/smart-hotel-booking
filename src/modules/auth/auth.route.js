const { Router } = require('express');
const authController = require('./auth.controller');

const router = Router();

router.get('/status', authController.getAuthStatus);

module.exports = router;
