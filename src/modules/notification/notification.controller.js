/**
 * notification.controller — Thông báo trong app + gửi email.
 *
 * Endpoints (mount tại /notifications):
 *   GET    /notifications              → getNotifications        — List có paging + đếm chưa đọc
 *   PATCH  /notifications/:id/read     → markAsRead              — Đánh dấu 1 thông báo đã đọc
 *   PATCH  /notifications/read-all     → markAllAsRead           — Đánh dấu tất cả đã đọc
 *   DELETE /notifications/:id          → deleteNotification      — Xoá 1 thông báo
 *   POST   /notifications/system       → createSystemNotification — Admin: gửi thông báo cho tất cả user
 *
 * Ngoài ra, service file còn export các hàm "fire-and-forget" để các module
 * khác (booking, payment, review) gọi tạo notification — không qua HTTP.
 */
const notificationService = require('./notification.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await notificationService.getUserNotifications(req.user.userId, page, limit);

  return res.status(200).json({
    notifications: result.notifications,
    total: result.total,
    unread_count: result.unread_count,
    page,
    limit,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notificationId = Number(req.params.id);

  const updated = await notificationService.markAsRead(notificationId, req.user.userId);

  return res.status(200).json({ id: updated.id, is_read: true });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const updatedCount = await notificationService.markAllAsRead(req.user.userId);

  return res.status(200).json({ updated_count: updatedCount });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = Number(req.params.id);

  await notificationService.deleteNotification(notificationId, req.user.userId);

  return res.status(200).json({ message: 'Xóa thông báo thành công' });
});

const createSystemNotification = asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  const createdCount = await notificationService.createSystemNotification(title, message);

  return res.status(201).json({ created_count: createdCount });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createSystemNotification,
};
