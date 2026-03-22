const { Router } = require('express');
const hotelController = require('./hotel.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const validate = require('../../common/middleware/validate');
const hotelSchemas = require('./hotel.schema');

const router = Router();

router.get('/', hotelController.getHotels);
router.post('/', authMiddleware, validate(hotelSchemas.createHotel), hotelController.createHotel);
router.get('/:id', validate(hotelSchemas.getHotelDetail), hotelController.getHotelDetail);

module.exports = router;
