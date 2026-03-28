const Joi = require("joi");

const payBooking = {
  body: Joi.object({
    booking_id: Joi.number().integer().positive().required().messages({
      "number.base": "ID đặt phòng phải là số",
      "number.integer": "ID đặt phòng phải là số nguyên",
      "number.positive": "ID đặt phòng phải là số dương",
      "any.required": "ID đặt phòng là bắt buộc",
    }),
  }),
};

const refund = {
  body: Joi.object({
    booking_id: Joi.number().integer().positive().required().messages({
      "number.base": "ID đặt phòng phải là số",
      "number.integer": "ID đặt phòng phải là số nguyên",
      "number.positive": "ID đặt phòng phải là số dương",
      "any.required": "ID đặt phòng là bắt buộc",
    }),
  }),
};

const getAllPayments = {
  query: Joi.object({
    status: Joi.string().valid("SUCCESS", "REFUNDED").messages({
      "any.only": "Trạng thái phải là SUCCESS hoặc REFUNDED",
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Trang phải là số",
      "number.integer": "Trang phải là số nguyên",
      "number.min": "Trang phải lớn hơn hoặc bằng 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Giới hạn phải là số",
      "number.integer": "Giới hạn phải là số nguyên",
      "number.min": "Giới hạn phải lớn hơn hoặc bằng 1",
      "number.max": "Giới hạn không được vượt quá 100",
    }),
  }),
};

const getPaymentDetail = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID giao dịch phải là số",
      "number.integer": "ID giao dịch phải là số nguyên",
      "number.positive": "ID giao dịch phải là số dương",
      "any.required": "ID giao dịch là bắt buộc",
    }),
  }),
};

module.exports = { payBooking, refund, getAllPayments, getPaymentDetail };
