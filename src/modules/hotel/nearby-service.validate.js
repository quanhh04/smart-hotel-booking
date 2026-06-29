const { sendError } = require('../../common/middleware/validate');

const VALID_CATEGORIES = ['food', 'attraction', 'wellness', 'transport', 'nightlife'];

const validateGetNearbyServices = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return sendError(res, 'ID khách sạn phải là số nguyên dương');
  }

  const { category, limit } = req.query;
  if (category && !VALID_CATEGORIES.includes(category)) {
    return sendError(res, `Category phải là một trong: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0) return sendError(res, 'Limit phải là số nguyên dương');
    if (l > 50) return sendError(res, 'Limit không được vượt quá 50');
  }

  next();
};

const validateAdminGetAll = (req, res, next) => {
  const { hotel_id, category, page, limit } = req.query;

  if (hotel_id !== undefined && (!Number.isInteger(Number(hotel_id)) || Number(hotel_id) <= 0)) {
    return sendError(res, 'hotel_id phải là số nguyên dương');
  }
  if (category && !VALID_CATEGORIES.includes(category)) {
    return sendError(res, `Category phải là một trong: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return sendError(res, 'Số trang phải là số nguyên dương');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0) return sendError(res, 'Limit phải là số nguyên dương');
    if (l > 100) return sendError(res, 'Limit không được vượt quá 100');
  }

  next();
};

const validateAdminCreate = (req, res, next) => {
  const { hotel_id, category, name } = req.body;

  if (!hotel_id || !Number.isInteger(Number(hotel_id)) || Number(hotel_id) <= 0) {
    return sendError(res, 'hotel_id là bắt buộc và phải là số nguyên dương');
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return sendError(res, `Category là bắt buộc và phải là một trong: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return sendError(res, 'Tên dịch vụ là bắt buộc');
  }

  const { rating } = req.body;
  if (rating !== undefined && rating !== null) {
    const r = Number(rating);
    if (isNaN(r) || r < 0 || r > 5) return sendError(res, 'Rating phải từ 0 đến 5');
  }

  next();
};

const validateAdminUpdate = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID dịch vụ phải là số nguyên dương');

  const { hotel_id, category, rating } = req.body;
  if (hotel_id !== undefined && (!Number.isInteger(Number(hotel_id)) || Number(hotel_id) <= 0)) {
    return sendError(res, 'hotel_id phải là số nguyên dương');
  }
  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    return sendError(res, `Category phải là một trong: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (rating !== undefined && rating !== null) {
    const r = Number(rating);
    if (isNaN(r) || r < 0 || r > 5) return sendError(res, 'Rating phải từ 0 đến 5');
  }

  next();
};

const validateAdminDelete = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID dịch vụ phải là số nguyên dương');
  next();
};

module.exports = { validateGetNearbyServices, validateAdminGetAll, validateAdminCreate, validateAdminUpdate, validateAdminDelete };
