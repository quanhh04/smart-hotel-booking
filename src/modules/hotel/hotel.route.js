const { Router } = require('express');
const hotelController = require('./hotel.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.get('/', hotelController.getHotels);
router.post('/', authMiddleware, hotelController.createHotel);

module.exports = router;
