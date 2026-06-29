const { sendError } = require('../../common/middleware/validate');

const validateGetHotels = (req, res, next) => {
  const { min_price, max_price, stars, min_rating, sort_by, sort_order, page, limit } = req.query;

  if (min_price !== undefined && (isNaN(Number(min_price)) || Number(min_price) < 0)) {
    return sendError(res, 'Giá tối thiểu phải là số >= 0');
  }
  if (max_price !== undefined && (isNaN(Number(max_price)) || Number(max_price) < 0)) {
    return sendError(res, 'Giá tối đa phải là số >= 0');
  }
  if (stars !== undefined) {
    // Hỗ trợ multi-value: "4,5" hoặc single "5"
    const parts = String(stars).split(',');
    for (const part of parts) {
      const s = Number(part.trim());
      if (!Number.isInteger(s) || s < 1 || s > 5) return sendError(res, 'Số sao phải từ 1 đến 5');
    }
  }
  if (min_rating !== undefined) {
    const r = Number(min_rating);
    if (isNaN(r) || r < 0 || r > 10) return sendError(res, 'Điểm đánh giá tối thiểu phải từ 0 đến 10');
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

const validateGetHotelDetail = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');
  next();
};

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

const validateDeleteHotel = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');
  next();
};

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
