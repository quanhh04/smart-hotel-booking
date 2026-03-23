const { Router } = require('express');
const notificationController = require('./notification.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const requireAdmin = require('../../common/middleware/require-admin');
const validate = require('../../common/middleware/validate');
const notificationSchemas = require('./notification.schema');

const router = Router();

router.get('/', authMiddleware, validate(notificationSchemas.getNotifications), notificationController.getNotifications);
router.patch('/:id/read', authMiddleware, validate(notificationSchemas.markAsRead), notificationController.markAsRead);
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead);
router.delete('/:id', authMiddleware, validate(notificationSchemas.deleteNotification), notificationController.deleteNotification);
router.post('/system', authMiddleware, requireAdmin, validate(notificationSchemas.createSystemNotification), notificationController.createSystemNotification);

module.exports = router;
