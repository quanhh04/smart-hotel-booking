const { Router } = require('express');
const adminController = require('./admin.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const adminSchemas = require('./admin.schema');

const router = Router();

router.get('/stats', authMiddleware, requireAdmin, adminController.getStats);
router.get('/revenue', authMiddleware, requireAdmin, validate(adminSchemas.getRevenue), adminController.getRevenue);
router.get('/users', authMiddleware, requireAdmin, validate(adminSchemas.getUsers), adminController.getUsers);
router.get('/top-hotels', authMiddleware, requireAdmin, validate(adminSchemas.getTopHotels), adminController.getTopHotels);

module.exports = router;
