const { Router } = require('express');
const bookingController = require('./booking.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.post('/', authMiddleware, bookingController.createBooking);

module.exports = router;
