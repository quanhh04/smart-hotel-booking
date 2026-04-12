const { sendError } = require('../../common/middleware/validate');

/**
 * GET /notifications
 * Query: { page?, limit? }
 */
const validateGetNotifications = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p < 1) return sendError(res, 'Trang phải là số nguyên >= 1');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1) return sendError(res, 'Số lượng phải là số nguyên >= 1');
    if (l > 50) return sendError(res, 'Số lượng không được vượt quá 50');
  }

  next();
};

/**
 * PATCH /notifications/:id/read
 * Params: { id }
 */
const validateMarkAsRead = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID thông báo phải là số nguyên dương');
  next();
};

/**
 * DELETE /notifications/:id
 * Params: { id }
 */
const validateDeleteNotification = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID thông báo phải là số nguyên dương');
  next();
};

/**
 * POST /notifications/system
 * Body: { title, message }
 */
const validateCreateSystemNotification = (req, res, next) => {
  const { title, message } = req.body;

  if (!title) return sendError(res, 'Tiêu đề là bắt buộc');
  if (typeof title !== 'string') return sendError(res, 'Tiêu đề phải là chuỗi ký tự');
  if (title.length > 200) return sendError(res, 'Tiêu đề không được vượt quá 200 ký tự');

  if (!message) return sendError(res, 'Nội dung là bắt buộc');
  if (typeof message !== 'string') return sendError(res, 'Nội dung phải là chuỗi ký tự');
  if (message.length > 2000) return sendError(res, 'Nội dung không được vượt quá 2000 ký tự');

  next();
};

module.exports = { validateGetNotifications, validateMarkAsRead, validateDeleteNotification, validateCreateSystemNotification };
