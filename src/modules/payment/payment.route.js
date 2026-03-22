const { Router } = require('express');
const paymentController = require('./payment.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const validate = require('../../common/middleware/validate');
const paymentSchemas = require('./payment.schema');

const router = Router();

router.get('/', authMiddleware, paymentController.getPayments);
router.post('/pay', authMiddleware, validate(paymentSchemas.payBooking), paymentController.payBooking);

module.exports = router;
