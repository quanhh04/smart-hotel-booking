const { Router } = require('express');
const hotelController = require('./hotel.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateGetHotels, validateCreateHotel, validateGetHotelDetail, validateUpdateHotel, validateDeleteHotel, validateGetHotelRooms } = require('./hotel.validate');

const router = Router();

router.get('/', validateGetHotels, hotelController.getHotels);
router.post('/', authMiddleware, requireAdmin, validateCreateHotel, hotelController.createHotel);
router.get('/:id/rooms', validateGetHotelRooms, hotelController.getHotelRooms);
router.get('/:id', validateGetHotelDetail, hotelController.getHotelDetail);
router.put('/:id', authMiddleware, requireAdmin, validateUpdateHotel, hotelController.updateHotel);
router.delete('/:id', authMiddleware, requireAdmin, validateDeleteHotel, hotelController.deleteHotel);

module.exports = router;
