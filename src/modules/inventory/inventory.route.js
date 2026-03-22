const { Router } = require('express');
const inventoryController = require('./inventory.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const inventorySchemas = require('./inventory.schema');

const router = Router();

router.patch('/rooms/:id/inventory', authMiddleware, requireAdmin, validate(inventorySchemas.updateInventory), inventoryController.updateInventory);
router.get('/hotels/:id/inventory', authMiddleware, requireAdmin, validate(inventorySchemas.getHotelInventory), inventoryController.getHotelInventory);

module.exports = router;
