const { Router } = require('express');
const inventoryController = require('./inventory.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = Router();

router.patch('/rooms/:id/inventory', authMiddleware, inventoryController.updateInventory);
router.get('/hotels/:id/inventory', authMiddleware, inventoryController.getHotelInventory);

module.exports = router;
