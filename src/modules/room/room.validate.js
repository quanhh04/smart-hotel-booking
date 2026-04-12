const { sendError } = require('../../common/middleware/validate');

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * GET /rooms
 * Query: { minPrice?, maxPrice?, guests?, amenities?, check_in?, check_out?, page?, limit? }
 */
const validateGetRooms = (req, res, next) => {
  const { minPrice, maxPrice, guests, check_in, check_out, page, limit } = req.query;

  if (minPrice !== undefined && (isNaN(Number(minPrice)) || Number(minPrice) < 1)) {
    return sendError(res, 'Giá tối thiểu phải là số >= 1');
  }
  if (maxPrice !== undefined && (isNaN(Number(maxPrice)) || Number(maxPrice) < 1)) {
    return sendError(res, 'Giá tối đa phải là số >= 1');
  }
  if (guests !== undefined && (!Number.isInteger(Number(guests)) || Number(guests) <= 0)) {
    return sendError(res, 'Số khách phải là số nguyên dương');
  }
  if (check_in !== undefined && (!ISO_DATE_RE.test(check_in) || isNaN(Date.parse(check_in)))) {
    return sendError(res, 'Ngày nhận phòng phải đúng định dạng ISO 8601');
  }
  if (check_out !== undefined && (!ISO_DATE_RE.test(check_out) || isNaN(Date.parse(check_out)))) {
    return sendError(res, 'Ngày trả phòng phải đúng định dạng ISO 8601');
  }
  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return sendError(res, 'Trang phải là số nguyên dương');
  }
  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return sendError(res, 'Giới hạn phải là số nguyên dương');
  }

  next();
};

/**
 * POST /rooms
 * Body: { hotel_id, name, price_per_night, max_guests, description, amenities, total_quantity, bed?, size? }
 */
const validateCreateRoom = (req, res, next) => {
  const { hotel_id, name, price_per_night, max_guests, description, amenities, total_quantity } = req.body;

  if (!hotel_id) return sendError(res, 'ID khách sạn là bắt buộc');
  if (!Number.isInteger(Number(hotel_id)) || Number(hotel_id) <= 0) {
    return sendError(res, 'ID khách sạn phải là số nguyên dương');
  }

  if (!name) return sendError(res, 'Tên phòng là bắt buộc');
  if (typeof name !== 'string' || name.length < 1) return sendError(res, 'Tên phòng phải là chuỗi không rỗng');

  if (price_per_night === undefined || price_per_night === null) return sendError(res, 'Giá mỗi đêm là bắt buộc');
  if (isNaN(Number(price_per_night)) || Number(price_per_night) < 1) {
    return sendError(res, 'Giá mỗi đêm phải là số >= 1');
  }

  if (!max_guests) return sendError(res, 'Số khách tối đa là bắt buộc');
  if (!Number.isInteger(Number(max_guests)) || Number(max_guests) <= 0) {
    return sendError(res, 'Số khách tối đa phải là số nguyên dương');
  }

  if (!description) return sendError(res, 'Mô tả là bắt buộc');
  if (typeof description !== 'string' || description.length < 1) return sendError(res, 'Mô tả phải là chuỗi không rỗng');

  if (!amenities) return sendError(res, 'Tiện nghi là bắt buộc');
  if (!Array.isArray(amenities)) return sendError(res, 'Tiện nghi phải là mảng');

  if (!total_quantity) return sendError(res, 'Tổng số lượng là bắt buộc');
  if (!Number.isInteger(Number(total_quantity)) || Number(total_quantity) <= 0) {
    return sendError(res, 'Tổng số lượng phải là số nguyên dương');
  }

  next();
};

/**
 * PUT /rooms/:id
 * Params: { id }, Body: { name?, price_per_night?, max_guests?, description?, amenities?, bed?, size? }
 */
const validateUpdateRoom = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID phòng phải là số nguyên dương');

  const { name, price_per_night, max_guests, description, amenities } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.length < 1)) {
    return sendError(res, 'Tên phòng phải là chuỗi không rỗng');
  }
  if (price_per_night !== undefined && (isNaN(Number(price_per_night)) || Number(price_per_night) < 1)) {
    return sendError(res, 'Giá mỗi đêm phải là số >= 1');
  }
  if (max_guests !== undefined && (!Number.isInteger(Number(max_guests)) || Number(max_guests) <= 0)) {
    return sendError(res, 'Số khách tối đa phải là số nguyên dương');
  }
  if (description !== undefined && (typeof description !== 'string' || description.length < 1)) {
    return sendError(res, 'Mô tả phải là chuỗi không rỗng');
  }
  if (amenities !== undefined && !Array.isArray(amenities)) {
    return sendError(res, 'Tiện nghi phải là mảng');
  }

  next();
};

/**
 * DELETE /rooms/:id
 * Params: { id }
 */
const validateDeleteRoom = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID phòng phải là số nguyên dương');
  next();
};

module.exports = { validateGetRooms, validateCreateRoom, validateUpdateRoom, validateDeleteRoom };
