const { Router } = require('express');
const bookingController = require('./booking.controller');

const router = Router();

router.get('/status', bookingController.getBookingStatus);

module.exports = router;
