const { Router } = require('express');
const paymentController = require('./payment.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const paymentSchemas = require('./payment.schema');

const router = Router();

router.get('/', authMiddleware, paymentController.getPayments);
router.post('/pay', authMiddleware, validate(paymentSchemas.payBooking), paymentController.payBooking);
router.post('/refund', authMiddleware, requireAdmin, validate(paymentSchemas.refund), paymentController.refund);
router.get('/admin/all', authMiddleware, requireAdmin, validate(paymentSchemas.getAllPayments), paymentController.getAllPayments);
router.get('/:id', authMiddleware, validate(paymentSchemas.getPaymentDetail), paymentController.getPaymentDetail);

module.exports = router;
