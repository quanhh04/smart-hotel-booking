const { sendError } = require('../../common/middleware/validate');

/**
 * GET /cities/:id
 * Params: { id }
 */
const validateGetCityDetail = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID thành phố phải là số nguyên dương');
  next();
};

/**
 * POST /cities
 * Body: { name, subtitle?, thumbnail? }
 */
const validateCreateCity = (req, res, next) => {
  const { name } = req.body;
  if (!name) return sendError(res, 'Tên thành phố là bắt buộc');
  if (typeof name !== 'string') return sendError(res, 'Tên thành phố phải là chuỗi ký tự');
  next();
};

/**
 * PUT /cities/:id
 * Params: { id }, Body: { name?, subtitle?, thumbnail? }
 */
const validateUpdateCity = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID thành phố phải là số nguyên dương');
  next();
};

/**
 * DELETE /cities/:id
 * Params: { id }
 */
const validateDeleteCity = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID thành phố phải là số nguyên dương');
  next();
};

module.exports = { validateGetCityDetail, validateCreateCity, validateUpdateCity, validateDeleteCity };
