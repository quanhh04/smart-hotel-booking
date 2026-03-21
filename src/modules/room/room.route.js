const { Router } = require('express');
const roomController = require('./room.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomDetail);
router.post('/', authMiddleware, roomController.createRoom);

module.exports = router;
