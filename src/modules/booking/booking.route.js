const { Router } = require('express');
const bookingController = require('./booking.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const bookingSchemas = require('./booking.schema');

const router = Router();

router.get('/admin/all', authMiddleware, requireAdmin, validate(bookingSchemas.getAllBookings), bookingController.getAllBookings);
router.get('/:id', authMiddleware, validate(bookingSchemas.getBookingDetail), bookingController.getBookingDetail);
router.get('/', authMiddleware, bookingController.getBookings);
router.post('/', authMiddleware, validate(bookingSchemas.createBooking), bookingController.createBooking);
router.patch('/:id/cancel', authMiddleware, validate(bookingSchemas.cancelBooking), bookingController.cancelBooking);

module.exports = router;
