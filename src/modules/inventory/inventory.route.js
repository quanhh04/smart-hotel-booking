const { Router } = require('express');
const inventoryController = require('./inventory.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const validate = require('../../common/middleware/validate');
const inventorySchemas = require('./inventory.schema');

const router = Router();

router.patch('/rooms/:id/inventory', authMiddleware, validate(inventorySchemas.updateInventory), inventoryController.updateInventory);
router.get('/hotels/:id/inventory', authMiddleware, validate(inventorySchemas.getHotelInventory), inventoryController.getHotelInventory);

module.exports = router;
