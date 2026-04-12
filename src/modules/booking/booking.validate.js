const { sendError } = require('../../common/middleware/validate');

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * POST /bookings
 * Body: { room_type_id, check_in, check_out, payment_method? }
 */
const validateCreateBooking = (req, res, next) => {
  const { room_type_id, check_in, check_out, payment_method } = req.body;

  if (!room_type_id) return sendError(res, 'Mã loại phòng là bắt buộc');
  if (!Number.isInteger(Number(room_type_id)) || Number(room_type_id) <= 0) {
    return sendError(res, 'Mã loại phòng phải là số nguyên dương');
  }

  if (!check_in) return sendError(res, 'Ngày nhận phòng là bắt buộc');
  if (!ISO_DATE_RE.test(check_in) || isNaN(Date.parse(check_in))) {
    return sendError(res, 'Ngày nhận phòng phải đúng định dạng ISO 8601');
  }

  if (!check_out) return sendError(res, 'Ngày trả phòng là bắt buộc');
  if (!ISO_DATE_RE.test(check_out) || isNaN(Date.parse(check_out))) {
    return sendError(res, 'Ngày trả phòng phải đúng định dạng ISO 8601');
  }

  if (payment_method !== undefined && !['online', 'pay_at_hotel'].includes(payment_method)) {
    return sendError(res, 'Hình thức thanh toán phải là: online hoặc pay_at_hotel');
  }

  next();
};

/**
 * PATCH /bookings/:id/cancel
 * Params: { id }
 */
const validateCancelBooking = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID đặt phòng phải là số nguyên dương');
  next();
};

/**
 * GET /bookings/:id
 * Params: { id }
 */
const validateGetBookingDetail = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID đặt phòng phải là số nguyên dương');
  next();
};

/**
 * GET /bookings/admin/all
 * Query: { status?, page?, limit? }
 */
const validateGetAllBookings = (req, res, next) => {
  const { status, page, limit } = req.query;

  if (status !== undefined && !['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'REFUNDED'].includes(status)) {
    return sendError(res, 'Trạng thái phải là: PENDING, CONFIRMED, PAID, CANCELLED, REFUNDED');
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

module.exports = { validateCreateBooking, validateCancelBooking, validateGetBookingDetail, validateGetAllBookings };
