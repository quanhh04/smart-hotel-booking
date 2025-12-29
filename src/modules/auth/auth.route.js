const { Router } = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
