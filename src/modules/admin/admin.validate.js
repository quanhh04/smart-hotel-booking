const { sendError } = require('../../common/middleware/validate');

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * GET /admin/revenue
 * Query: { start_date, end_date }
 */
const validateGetRevenue = (req, res, next) => {
  const { start_date, end_date } = req.query;

  if (!start_date) return sendError(res, 'Ngày bắt đầu là bắt buộc');
  if (!ISO_DATE_RE.test(start_date) || isNaN(Date.parse(start_date))) {
    return sendError(res, 'Ngày bắt đầu phải đúng định dạng ISO 8601');
  }

  if (!end_date) return sendError(res, 'Ngày kết thúc là bắt buộc');
  if (!ISO_DATE_RE.test(end_date) || isNaN(Date.parse(end_date))) {
    return sendError(res, 'Ngày kết thúc phải đúng định dạng ISO 8601');
  }

  next();
};

/**
 * GET /admin/users
 * Query: { page?, limit? }
 */
const validateGetUsers = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return sendError(res, 'Số trang phải là số nguyên dương');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0) return sendError(res, 'Số lượng mỗi trang phải là số nguyên dương');
    if (l > 100) return sendError(res, 'Số lượng mỗi trang không được vượt quá 100');
  }

  next();
};

/**
 * GET /admin/top-hotels
 * Query: { sort_by?, limit? }
 */
const validateGetTopHotels = (req, res, next) => {
  const { sort_by, limit } = req.query;

  if (sort_by !== undefined && !['revenue', 'booking_count'].includes(sort_by)) {
    return sendError(res, 'Tiêu chí sắp xếp phải là: revenue hoặc booking_count');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0) return sendError(res, 'Số lượng phải là số nguyên dương');
    if (l > 50) return sendError(res, 'Số lượng không được vượt quá 50');
  }

  next();
};

module.exports = { validateGetRevenue, validateGetUsers, validateGetTopHotels };
