const { Router } = require('express');
const paymentController = require('./payment.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.post('/pay', authMiddleware, paymentController.payBooking);

module.exports = router;
