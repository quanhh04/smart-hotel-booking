const { Router } = require('express');
const roomController = require('./room.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateGetRooms, validateCreateRoom, validateUpdateRoom, validateDeleteRoom } = require('./room.validate');

const router = Router();

router.get('/', validateGetRooms, roomController.getRooms);
router.post('/', authMiddleware, requireAdmin, validateCreateRoom, roomController.createRoom);
router.put('/:id', authMiddleware, requireAdmin, validateUpdateRoom, roomController.updateRoom);
router.delete('/:id', authMiddleware, requireAdmin, validateDeleteRoom, roomController.deleteRoom);

module.exports = router;
