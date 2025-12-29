const { Router } = require('express');
const paymentController = require('./payment.controller');

const router = Router();

router.get('/status', paymentController.getPaymentStatus);

module.exports = router;
