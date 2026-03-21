const { Router } = require('express');
const bookingController = require('./booking.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.get('/', authMiddleware, bookingController.getBookings);
router.post('/', authMiddleware, bookingController.createBooking);
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
