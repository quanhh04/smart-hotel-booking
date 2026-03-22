const { Router } = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const validate = require('../../common/middleware/validate');
const authSchemas = require('./auth.schema');

const router = Router();

router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
