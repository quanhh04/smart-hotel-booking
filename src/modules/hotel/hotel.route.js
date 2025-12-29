const { Router } = require('express');
const hotelController = require('./hotel.controller');

const router = Router();

router.get('/status', hotelController.getHotelStatus);

module.exports = router;
