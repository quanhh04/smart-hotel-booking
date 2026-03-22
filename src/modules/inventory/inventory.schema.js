const Joi = require("joi");

const updateInventory = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID loại phòng phải là số",
      "number.integer": "ID loại phòng phải là số nguyên",
      "number.positive": "ID loại phòng phải là số dương",
      "any.required": "ID loại phòng là bắt buộc",
    }),
  }),
  body: Joi.object({
    total_quantity: Joi.number().integer().min(0).required().messages({
      "number.base": "Tổng số lượng phải là số",
      "number.integer": "Tổng số lượng phải là số nguyên",
      "number.min": "Tổng số lượng không được nhỏ hơn {#limit}",
      "any.required": "Tổng số lượng là bắt buộc",
    }),
  }),
};

const getHotelInventory = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID khách sạn phải là số",
      "number.integer": "ID khách sạn phải là số nguyên",
      "number.positive": "ID khách sạn phải là số dương",
      "any.required": "ID khách sạn là bắt buộc",
    }),
  }),
  query: Joi.object({
    check_in: Joi.date().iso().messages({
      "date.base": "Ngày nhận phòng không hợp lệ",
      "date.format": "Ngày nhận phòng phải đúng định dạng ISO 8601",
    }),
    check_out: Joi.date().iso().messages({
      "date.base": "Ngày trả phòng không hợp lệ",
      "date.format": "Ngày trả phòng phải đúng định dạng ISO 8601",
    }),
  }).with("check_out", "check_in").messages({
    "object.with": "Khi có ngày trả phòng thì phải có ngày nhận phòng",
  }),
};

module.exports = { updateInventory, getHotelInventory };
