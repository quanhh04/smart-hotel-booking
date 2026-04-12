const { sendError } = require('../../common/middleware/validate');

/**
 * GET /hotels
 * Query: { keyword?, min_price?, max_price?, stars?, sort_by?, sort_order?, page?, limit? }
 */
const validateGetHotels = (req, res, next) => {
  const { min_price, max_price, stars, sort_by, sort_order, page, limit } = req.query;

  if (min_price !== undefined && (isNaN(Number(min_price)) || Number(min_price) < 0)) {
    return sendError(res, 'Giá tối thiểu phải là số >= 0');
  }
  if (max_price !== undefined && (isNaN(Number(max_price)) || Number(max_price) < 0)) {
    return sendError(res, 'Giá tối đa phải là số >= 0');
  }
  if (stars !== undefined) {
    const s = Number(stars);
    if (!Number.isInteger(s) || s < 1 || s > 5) return sendError(res, 'Số sao phải từ 1 đến 5');
  }
  if (sort_by !== undefined && !['rating', 'price_from', 'created_at'].includes(sort_by)) {
    return sendError(res, 'Tiêu chí sắp xếp phải là: rating, price_from, created_at');
  }
  if (sort_order !== undefined && !['ASC', 'DESC'].includes(sort_order)) {
    return sendError(res, 'Thứ tự sắp xếp phải là ASC hoặc DESC');
  }
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
 * POST /hotels
 * Body: { name, address, description }
 */
const validateCreateHotel = (req, res, next) => {
  const { name, address, description } = req.body;

  if (!name) return sendError(res, 'Tên khách sạn là bắt buộc');
  if (typeof name !== 'string' || name.length < 1) return sendError(res, 'Tên khách sạn phải là chuỗi không rỗng');

  if (!address) return sendError(res, 'Địa chỉ là bắt buộc');
  if (typeof address !== 'string' || address.length < 1) return sendError(res, 'Địa chỉ phải là chuỗi không rỗng');

  if (!description) return sendError(res, 'Mô tả là bắt buộc');
  if (typeof description !== 'string' || description.length < 1) return sendError(res, 'Mô tả phải là chuỗi không rỗng');

  next();
};

/**
 * GET /hotels/:id
 * Params: { id }
 */
const validateGetHotelDetail = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');
  next();
};

/**
 * PUT /hotels/:id
 * Params: { id }, Body: { name?, address?, description? }
 */
const validateUpdateHotel = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');

  const { name, address, description } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.length < 1)) {
    return sendError(res, 'Tên khách sạn phải là chuỗi không rỗng');
  }
  if (address !== undefined && (typeof address !== 'string' || address.length < 1)) {
    return sendError(res, 'Địa chỉ phải là chuỗi không rỗng');
  }
  if (description !== undefined && (typeof description !== 'string' || description.length < 1)) {
    return sendError(res, 'Mô tả phải là chuỗi không rỗng');
  }

  next();
};

/**
 * DELETE /hotels/:id
 * Params: { id }
 */
const validateDeleteHotel = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');
  next();
};

/**
 * GET /hotels/:id/rooms
 * Params: { id }, Query: { page?, limit? }
 */
const validateGetHotelRooms = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');

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

module.exports = {
  validateGetHotels,
  validateCreateHotel,
  validateGetHotelDetail,
  validateUpdateHotel,
  validateDeleteHotel,
  validateGetHotelRooms,
};
