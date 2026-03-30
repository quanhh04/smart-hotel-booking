const { Router } = require('express');
const hotelController = require('./hotel.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const hotelSchemas = require('./hotel.schema');

const router = Router();

router.get('/', validate(hotelSchemas.getHotels), hotelController.getHotels);
router.post('/', authMiddleware, requireAdmin, validate(hotelSchemas.createHotel), hotelController.createHotel);
router.get('/:id/rooms', validate(hotelSchemas.getHotelRooms), hotelController.getHotelRooms);
router.get('/:id', validate(hotelSchemas.getHotelDetail), hotelController.getHotelDetail);
router.put('/:id', authMiddleware, requireAdmin, validate(hotelSchemas.updateHotel), hotelController.updateHotel);
router.delete('/:id', authMiddleware, requireAdmin, validate(hotelSchemas.deleteHotel), hotelController.deleteHotel);

module.exports = router;
