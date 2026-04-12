const { sendError } = require('../../common/middleware/validate');

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * PATCH /rooms/:id/inventory
 * Params: { id }, Body: { total_quantity }
 */
const validateUpdateInventory = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID loại phòng phải là số nguyên dương');

  const { total_quantity } = req.body;
  if (total_quantity === undefined || total_quantity === null) return sendError(res, 'Tổng số lượng là bắt buộc');
  if (isNaN(Number(total_quantity)) || Number(total_quantity) < 0) {
    return sendError(res, 'Tổng số lượng phải là số >= 0');
  }

  next();
};

/**
 * GET /hotels/:id/inventory
 * Params: { id }, Query: { check_in?, check_out? }
 */
const validateGetHotelInventory = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');

  const { check_in, check_out } = req.query;
  if (check_in !== undefined && (!ISO_DATE_RE.test(check_in) || isNaN(Date.parse(check_in)))) {
    return sendError(res, 'Ngày nhận phòng phải đúng định dạng ISO 8601');
  }
  if (check_out !== undefined && (!ISO_DATE_RE.test(check_out) || isNaN(Date.parse(check_out)))) {
    return sendError(res, 'Ngày trả phòng phải đúng định dạng ISO 8601');
  }

  next();
};

module.exports = { validateUpdateInventory, validateGetHotelInventory };
