const Joi = require("joi");

const createHotel = {
  body: Joi.object({
    name: Joi.string().trim().min(1).required().messages({
      "string.base": "Tên khách sạn phải là chuỗi ký tự",
      "string.empty": "Tên khách sạn không được để trống",
      "string.min": "Tên khách sạn không được để trống",
      "any.required": "Tên khách sạn là bắt buộc",
    }),
    address: Joi.string().trim().min(1).required().messages({
      "string.base": "Địa chỉ phải là chuỗi ký tự",
      "string.empty": "Địa chỉ không được để trống",
      "string.min": "Địa chỉ không được để trống",
      "any.required": "Địa chỉ là bắt buộc",
    }),
    description: Joi.string().trim().min(1).required().messages({
      "string.base": "Mô tả phải là chuỗi ký tự",
      "string.empty": "Mô tả không được để trống",
      "string.min": "Mô tả không được để trống",
      "any.required": "Mô tả là bắt buộc",
    }),
  }),
};

const getHotelDetail = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
};

module.exports = { createHotel, getHotelDetail };
