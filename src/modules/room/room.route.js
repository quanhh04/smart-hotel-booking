const { Router } = require('express');
const roomController = require('./room.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const roomSchemas = require('./room.schema');

const router = Router();

router.get('/', validate(roomSchemas.getRooms), roomController.getRooms);
router.get('/:id', validate(roomSchemas.getRoomDetail), roomController.getRoomDetail);
router.post('/', authMiddleware, requireAdmin, validate(roomSchemas.createRoom), roomController.createRoom);

module.exports = router;
