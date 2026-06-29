const { sendError } = require('../../common/middleware/validate');

const validateCreateReview = (req, res, next) => {
  const { booking_id, rating, comment } = req.body;

  if (!booking_id) return sendError(res, 'Mã booking là bắt buộc');
  if (!Number.isInteger(Number(booking_id)) || Number(booking_id) <= 0) {
    return sendError(res, 'Mã booking phải là số nguyên dương');
  }

  if (rating === undefined || rating === null) return sendError(res, 'Điểm đánh giá là bắt buộc');
  const r = Number(rating);
  if (isNaN(r) || r < 1 || r > 10) return sendError(res, 'Điểm đánh giá phải từ 1 đến 10');

  if (!comment) return sendError(res, 'Nội dung đánh giá là bắt buộc');
  if (typeof comment !== 'string') return sendError(res, 'Nội dung đánh giá phải là chuỗi ký tự');
  if (comment.length < 10) return sendError(res, 'Nội dung đánh giá phải có ít nhất 10 ký tự');
  if (comment.length > 1000) return sendError(res, 'Nội dung đánh giá không được vượt quá 1000 ký tự');

  next();
};

const validateUpdateReview = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID đánh giá phải là số nguyên dương');

  const { rating, comment } = req.body;

  if (rating === undefined || rating === null) return sendError(res, 'Điểm đánh giá là bắt buộc');
  const r = Number(rating);
  if (isNaN(r) || r < 1 || r > 10) return sendError(res, 'Điểm đánh giá phải từ 1 đến 10');

  if (!comment) return sendError(res, 'Nội dung đánh giá là bắt buộc');
  if (typeof comment !== 'string') return sendError(res, 'Nội dung đánh giá phải là chuỗi ký tự');
  if (comment.length < 10) return sendError(res, 'Nội dung đánh giá phải có ít nhất 10 ký tự');
  if (comment.length > 1000) return sendError(res, 'Nội dung đánh giá không được vượt quá 1000 ký tự');

  next();
};

const validateGetHotelReviews = (req, res, next) => {
  const hotelId = Number(req.params.hotelId);
  if (!Number.isInteger(hotelId) || hotelId <= 0) return sendError(res, 'ID khách sạn phải là số nguyên dương');

  const { page, limit } = req.query;
  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return sendError(res, 'Trang phải là số nguyên dương');
  }
  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l <= 0) return sendError(res, 'Số lượng phải là số nguyên dương');
    if (l > 50) return sendError(res, 'Số lượng không được vượt quá 50');
  }

  next();
};

const validateDeleteReview = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return sendError(res, 'ID đánh giá phải là số nguyên dương');
  next();
};

module.exports = { validateCreateReview, validateUpdateReview, validateGetHotelReviews, validateDeleteReview };
