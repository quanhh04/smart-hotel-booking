const { Router } = require('express');
const imageController = require('./image.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');

const router = Router();

router.get('/', imageController.getImages);
router.post('/', authMiddleware, requireAdmin, imageController.createImage);
router.delete('/:id', authMiddleware, requireAdmin, imageController.deleteImage);

router.get('/hotel/:hotelId', imageController.getHotelImages);
router.post('/hotel/:hotelId', authMiddleware, requireAdmin, imageController.addHotelImage);
router.delete('/hotel/:hotelId/:imageId', authMiddleware, requireAdmin, imageController.removeHotelImage);

module.exports = router;
