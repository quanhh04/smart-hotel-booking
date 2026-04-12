const { Router } = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const { validateRegister, validateLogin, validateUpdateProfile, validateChangePassword, validateForgotPassword } = require('./auth.validate');

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, validateUpdateProfile, authController.updateProfile);
router.put('/change-password', authMiddleware, validateChangePassword, authController.changePassword);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

module.exports = router;
