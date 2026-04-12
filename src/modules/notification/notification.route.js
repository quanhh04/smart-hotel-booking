const { Router } = require('express');
const notificationController = require('./notification.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const { validateGetNotifications, validateMarkAsRead, validateDeleteNotification, validateCreateSystemNotification } = require('./notification.validate');

const router = Router();

router.get('/', authMiddleware, validateGetNotifications, notificationController.getNotifications);
router.patch('/:id/read', authMiddleware, validateMarkAsRead, notificationController.markAsRead);
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead);
router.delete('/:id', authMiddleware, validateDeleteNotification, notificationController.deleteNotification);
router.post('/system', authMiddleware, requireAdmin, validateCreateSystemNotification, notificationController.createSystemNotification);

module.exports = router;
