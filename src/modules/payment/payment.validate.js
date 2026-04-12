const { sendError } = require('../../common/middleware/validate');

/**
 * POST /payments/pay
 * Body: { booking_id }
 */
const validatePayBooking = (req, res, next) => {
  const { booking_id } = req.body;
  if (!booking_id) return sendError(res, 'ID đặt phòng là bắt buộc');
  if (!Number.isInteger(Number(booking_id)) || Number(booking_id) <= 0) {
    return sendError(res, 'ID đặt phòng phải là số nguyên dương');
  }
  next();
};

/**
 * POST /payments/refund
 * Body: { booking_id }
 */
const validateRefund = (req, res, next) => {
  const { booking_id } = req.body;
  if (!booking_id) return sendError(res, 'ID đặt phòng là bắt buộc');
  if (!Number.isInteger(Number(booking_id)) || Number(booking_id) <= 0) {
    return sendError(res, 'ID đặt phòng phải là số nguyên dương');
  }
  next();
};

/**
 * GET /payments/admin/all
 * Query: { status?, page?, limit? }
 */
const validateGetAllPayments = (req, res, next) => {
  const { status, page, limit } = req.query;

  if (status !== undefined && !['SUCCESS', 'REFUNDED'].includes(status)) {
    return sendError(res, 'Trạng thái phải là: SUCCESS hoặc REFUNDED');
  }
  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return sendError(res, 'Trang phải là số nguyên dương');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0) return sendError(res, 'Giới hạn phải là số nguyên dương');
    if (l > 100) return sendError(res, 'Giới hạn không được vượt quá 100');
  }

  next();
};

/**
 * GET /payments/:id
 * Params: { id }
 */
const validateGetPaymentDetail = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID giao dịch phải là số nguyên dương');
  next();
};

module.exports = { validatePayBooking, validateRefund, validateGetAllPayments, validateGetPaymentDetail };
