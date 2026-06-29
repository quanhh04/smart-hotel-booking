const { Router } = require('express');
const nearbyServiceController = require('./nearby-service.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateAdminGetAll, validateAdminCreate, validateAdminUpdate, validateAdminDelete } = require('./nearby-service.validate');

const router = Router();

router.get('/', authMiddleware, requireAdmin, validateAdminGetAll, nearbyServiceController.adminGetAll);
router.post('/', authMiddleware, requireAdmin, validateAdminCreate, nearbyServiceController.adminCreate);
router.put('/:id', authMiddleware, requireAdmin, validateAdminUpdate, nearbyServiceController.adminUpdate);
router.delete('/:id', authMiddleware, requireAdmin, validateAdminDelete, nearbyServiceController.adminDelete);

module.exports = router;
