const Joi = require("joi");

const payBooking = {
  body: Joi.object({
    booking_id: Joi.number().integer().positive().required().messages({
      "number.base": "ID đặt phòng phải là số",
      "number.integer": "ID đặt phòng phải là số nguyên",
      "number.positive": "ID đặt phòng phải là số dương",
      "any.required": "ID đặt phòng là bắt buộc",
    }),
    amount: Joi.number().positive().required().messages({
      "number.base": "Số tiền phải là số",
      "number.positive": "Số tiền phải lớn hơn 0",
      "any.required": "Số tiền là bắt buộc",
    }),
  }),
};

module.exports = { payBooking };
