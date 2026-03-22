const { Router } = require('express');
const bookingController = require('./booking.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const validate = require('../../common/middleware/validate');
const bookingSchemas = require('./booking.schema');

const router = Router();

router.get('/', authMiddleware, bookingController.getBookings);
router.post('/', authMiddleware, validate(bookingSchemas.createBooking), bookingController.createBooking);
router.patch('/:id/cancel', authMiddleware, validate(bookingSchemas.cancelBooking), bookingController.cancelBooking);

module.exports = router;
