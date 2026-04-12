const { Router } = require('express');
const paymentController = require('./payment.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validatePayBooking, validateRefund, validateGetAllPayments, validateGetPaymentDetail } = require('./payment.validate');

const router = Router();

router.get('/', authMiddleware, paymentController.getPayments);
router.post('/pay', authMiddleware, validatePayBooking, paymentController.payBooking);
router.post('/refund', authMiddleware, requireAdmin, validateRefund, paymentController.refund);
router.get('/admin/all', authMiddleware, requireAdmin, validateGetAllPayments, paymentController.getAllPayments);
router.get('/:id', authMiddleware, validateGetPaymentDetail, paymentController.getPaymentDetail);

module.exports = router;
