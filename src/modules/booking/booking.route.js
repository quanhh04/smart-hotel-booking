const { Router } = require('express');
const bookingController = require('./booking.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateGetAllBookings, validateGetBookingDetail, validateCreateBooking, validateCancelBooking } = require('./booking.validate');

const router = Router();

router.get('/admin/all', authMiddleware, requireAdmin, validateGetAllBookings, bookingController.getAllBookings);
router.get('/:id', authMiddleware, validateGetBookingDetail, bookingController.getBookingDetail);
router.get('/', authMiddleware, bookingController.getBookings);
router.post('/', authMiddleware, validateCreateBooking, bookingController.createBooking);
router.patch('/:id/cancel', authMiddleware, validateCancelBooking, bookingController.cancelBooking);

module.exports = router;
