const Joi = require("joi");

const createRoom = {
  body: Joi.object({
    hotel_id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
    name: Joi.string().trim().min(1).required().messages({
      "string.base": "Tên phòng phải là chuỗi ký tự",
      "string.empty": "Tên phòng không được để trống",
      "string.min": "Tên phòng không được để trống",
      "any.required": "Tên phòng là bắt buộc",
    }),
    price_per_night: Joi.number().positive().required().messages({
      "number.base": "Giá mỗi đêm phải là số",
      "number.positive": "Giá mỗi đêm phải lớn hơn 0",
      "any.required": "Giá mỗi đêm là bắt buộc",
    }),
    max_guests: Joi.number().integer().positive().required().messages({
      "number.base": "Số khách tối đa phải là số",
      "number.integer": "Số khách tối đa phải là số nguyên",
      "number.positive": "Số khách tối đa phải lớn hơn 0",
      "any.required": "Số khách tối đa là bắt buộc",
    }),
    description: Joi.string().trim().min(1).required().messages({
      "string.base": "Mô tả phải là chuỗi ký tự",
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả không được để trống",
      "any.required": "Mô tả là bắt buộc",
    }),
    amenities: Joi.array().items(Joi.string().trim()).required().messages({
      "array.base": "Tiện nghi phải là danh sách",
      "any.required": "Tiện nghi là bắt buộc",
    }),
    total_quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Tổng số lượng phải là số",
      "number.integer": "Tổng số lượng phải là số nguyên",
      "number.min": "Tổng số lượng phải ít nhất là {#limit}",
      "any.required": "Tổng số lượng là bắt buộc",
    }),
  }),
};

const getRooms = {
  query: Joi.object({
    minPrice: Joi.number().positive().messages({
      "number.base": "Giá tối thiểu phải là số",
      "number.positive": "Giá tối thiểu phải lớn hơn 0",
    }),
    maxPrice: Joi.number().positive().messages({
      "number.base": "Giá tối đa phải là số",
      "number.positive": "Giá tối đa phải lớn hơn 0",
    }),
    guests: Joi.number().integer().positive().messages({
      "number.base": "Số khách phải là số",
      "number.integer": "Số khách phải là số nguyên",
      "number.positive": "Số khách phải lớn hơn 0",
    }),
    amenities: Joi.string().messages({
      "string.base": "Tiện nghi phải là chuỗi ký tự",
    }),
    check_in: Joi.date().iso().messages({
      "date.base": "Ngày nhận phòng không hợp lệ",
      "date.format": "Ngày nhận phòng phải đúng định dạng ISO 8601",
    }),
    check_out: Joi.date().iso().messages({
      "date.base": "Ngày trả phòng không hợp lệ",
      "date.format": "Ngày trả phòng phải đúng định dạng ISO 8601",
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Trang phải là số",
      "number.integer": "Trang phải là số nguyên",
      "number.min": "Trang phải lớn hơn hoặc bằng 1",
    }),
    limit: Joi.number().integer().min(1).default(10).messages({
      "number.base": "Giới hạn phải là số",
      "number.integer": "Giới hạn phải là số nguyên",
      "number.min": "Giới hạn phải lớn hơn hoặc bằng 1",
    }),
  }).with("check_out", "check_in").messages({
    "object.with": "Khi có ngày trả phòng thì phải có ngày nhận phòng",
  }),
};

const getRoomDetail = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID phòng phải là số",
      "number.integer": "ID phòng phải là số nguyên",
      "number.positive": "ID phòng phải là số dương",
      "any.required": "ID phòng là bắt buộc",
    }),
  }),
};

const updateRoom = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID phòng phải là số",
      "number.integer": "ID phòng phải là số nguyên",
      "number.positive": "ID phòng phải là số dương",
      "any.required": "ID phòng là bắt buộc",
    }),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).messages({
      "string.base": "Tên phòng phải là chuỗi ký tự",
      "string.empty": "Tên phòng không được để trống",
      "string.min": "Tên phòng không được để trống",
    }),
    price_per_night: Joi.number().positive().messages({
      "number.base": "Giá mỗi đêm phải là số",
      "number.positive": "Giá mỗi đêm phải lớn hơn 0",
    }),
    max_guests: Joi.number().integer().positive().messages({
      "number.base": "Số khách tối đa phải là số",
      "number.integer": "Số khách tối đa phải là số nguyên",
      "number.positive": "Số khách tối đa phải lớn hơn 0",
    }),
    description: Joi.string().trim().min(1).messages({
      "string.base": "Mô tả phải là chuỗi ký tự",
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả không được để trống",
    }),
    amenities: Joi.array().items(Joi.number().integer().positive()).messages({
      "array.base": "Tiện nghi phải là danh sách",
      "number.base": "ID tiện nghi phải là số",
      "number.integer": "ID tiện nghi phải là số nguyên",
      "number.positive": "ID tiện nghi phải là số dương",
    }),
  }),
};

const deleteRoom = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID phòng phải là số",
      "number.integer": "ID phòng phải là số nguyên",
      "number.positive": "ID phòng phải là số dương",
      "any.required": "ID phòng là bắt buộc",
    }),
  }),
};

module.exports = { createRoom, getRooms, getRoomDetail, updateRoom, deleteRoom };
