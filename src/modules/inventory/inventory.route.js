const { Router } = require('express');
const inventoryController = require('./inventory.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateUpdateInventory, validateGetHotelInventory } = require('./inventory.validate');

const router = Router();

router.patch('/rooms/:id/inventory', authMiddleware, requireAdmin, validateUpdateInventory, inventoryController.updateInventory);
router.get('/hotels/:id/inventory', authMiddleware, requireAdmin, validateGetHotelInventory, inventoryController.getHotelInventory);

module.exports = router;
