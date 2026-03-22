const Joi = require("joi");

const createBooking = {
  body: Joi.object({
    room_type_id: Joi.number().integer().positive().required().messages({
      "number.base": "Mã loại phòng phải là số",
      "number.integer": "Mã loại phòng phải là số nguyên",
      "number.positive": "Mã loại phòng phải là số dương",
      "any.required": "Mã loại phòng là bắt buộc",
    }),
    check_in: Joi.date().iso().required().messages({
      "date.base": "Ngày nhận phòng không hợp lệ",
      "date.format": "Ngày nhận phòng phải đúng định dạng ISO 8601",
      "any.required": "Ngày nhận phòng là bắt buộc",
    }),
    check_out: Joi.date().iso().greater(Joi.ref("check_in")).required().messages({
      "date.base": "Ngày trả phòng không hợp lệ",
      "date.format": "Ngày trả phòng phải đúng định dạng ISO 8601",
      "date.greater": "Ngày trả phòng phải sau ngày nhận phòng",
      "any.required": "Ngày trả phòng là bắt buộc",
    }),
    payment_method: Joi.string().valid("online", "pay_at_hotel").default("online").messages({
      "any.only": "Hình thức thanh toán phải là \"online\" hoặc \"pay_at_hotel\"",
    }),
  }),
};

const cancelBooking = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID đặt phòng phải là số",
      "number.integer": "ID đặt phòng phải là số nguyên",
      "number.positive": "ID đặt phòng phải là số dương",
      "any.required": "ID đặt phòng là bắt buộc",
    }),
  }),
};

module.exports = { createBooking, cancelBooking };
