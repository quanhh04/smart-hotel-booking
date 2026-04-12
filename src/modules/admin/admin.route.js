const { Router } = require('express');
const adminController = require('./admin.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateGetRevenue, validateGetUsers, validateGetTopHotels } = require('./admin.validate');

const router = Router();

router.get('/stats', authMiddleware, requireAdmin, adminController.getStats);
router.get('/revenue', authMiddleware, requireAdmin, validateGetRevenue, adminController.getRevenue);
router.get('/users', authMiddleware, requireAdmin, validateGetUsers, adminController.getUsers);
router.get('/top-hotels', authMiddleware, requireAdmin, validateGetTopHotels, adminController.getTopHotels);

module.exports = router;
