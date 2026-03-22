const Joi = require("joi");

const createReview = {
  body: Joi.object({
    booking_id: Joi.number().integer().positive().required().messages({
      "number.base": "Mã booking phải là số",
      "number.integer": "Mã booking phải là số nguyên",
      "number.positive": "Mã booking phải là số dương",
      "any.required": "Mã booking là bắt buộc",
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Điểm đánh giá phải là số",
      "number.integer": "Điểm đánh giá phải là số nguyên",
      "number.min": "Điểm đánh giá tối thiểu là 1",
      "number.max": "Điểm đánh giá tối đa là 5",
      "any.required": "Điểm đánh giá là bắt buộc",
    }),
    comment: Joi.string().min(10).max(1000).required().messages({
      "string.base": "Nội dung đánh giá phải là chuỗi",
      "string.min": "Nội dung đánh giá phải có ít nhất 10 ký tự",
      "string.max": "Nội dung đánh giá không được vượt quá 1000 ký tự",
      "any.required": "Nội dung đánh giá là bắt buộc",
    }),
  }),
};

const updateReview = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID đánh giá phải là số",
      "number.integer": "ID đánh giá phải là số nguyên",
      "number.positive": "ID đánh giá phải là số dương",
      "any.required": "ID đánh giá là bắt buộc",
    }),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "number.base": "Điểm đánh giá phải là số",
      "number.integer": "Điểm đánh giá phải là số nguyên",
      "number.min": "Điểm đánh giá tối thiểu là 1",
      "number.max": "Điểm đánh giá tối đa là 5",
      "any.required": "Điểm đánh giá là bắt buộc",
    }),
    comment: Joi.string().min(10).max(1000).required().messages({
      "string.base": "Nội dung đánh giá phải là chuỗi",
      "string.min": "Nội dung đánh giá phải có ít nhất 10 ký tự",
      "string.max": "Nội dung đánh giá không được vượt quá 1000 ký tự",
      "any.required": "Nội dung đánh giá là bắt buộc",
    }),
  }),
};


const getHotelReviews = {
  params: Joi.object({
    hotelId: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Trang phải là số",
      "number.integer": "Trang phải là số nguyên",
      "number.min": "Trang tối thiểu là 1",
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      "number.base": "Số lượng phải là số",
      "number.integer": "Số lượng phải là số nguyên",
      "number.min": "Số lượng tối thiểu là 1",
      "number.max": "Số lượng tối đa là 50",
    }),
  }),
};

const deleteReview = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID đánh giá phải là số",
      "number.integer": "ID đánh giá phải là số nguyên",
      "number.positive": "ID đánh giá phải là số dương",
      "any.required": "ID đánh giá là bắt buộc",
    }),
  }),
};

module.exports = { createReview, updateReview, getHotelReviews, deleteReview };
