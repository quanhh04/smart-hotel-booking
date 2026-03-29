const Joi = require("joi");

const chat = {
  body: Joi.object({
    message: Joi.string().min(1).max(1000).required().messages({
      "string.base": "Tin nhắn phải là chuỗi ký tự",
      "string.empty": "Tin nhắn không được để trống",
      "string.min": "Tin nhắn phải có ít nhất {#limit} ký tự",
      "string.max": "Tin nhắn không được vượt quá {#limit} ký tự",
      "any.required": "Tin nhắn là bắt buộc",
    }),
    session_id: Joi.string().uuid().optional().messages({
      "string.guid": "Session ID phải là UUID hợp lệ",
    }),
  }),
};

const recommendations = {
  query: Joi.object({
    guests: Joi.number().integer().positive().optional().messages({
      "number.base": "Số khách phải là số",
      "number.integer": "Số khách phải là số nguyên",
      "number.positive": "Số khách phải là số dương",
    }),
    max_price: Joi.number().positive().optional().messages({
      "number.base": "Giá tối đa phải là số",
      "number.positive": "Giá tối đa phải là số dương",
    }),
    amenities: Joi.string().optional().messages({
      "string.base": "Tiện ích phải là chuỗi ký tự",
    }),
    limit: Joi.number().integer().min(1).max(20).default(5).messages({
      "number.base": "Giới hạn phải là số",
      "number.integer": "Giới hạn phải là số nguyên",
      "number.min": "Giới hạn phải ít nhất {#limit}",
      "number.max": "Giới hạn không được vượt quá {#limit}",
    }),
  }),
};

const trending = {
  query: Joi.object({
    days: Joi.number().integer().min(7).max(30).default(7).messages({
      "number.base": "Số ngày phải là số",
      "number.integer": "Số ngày phải là số nguyên",
      "number.min": "Số ngày phải ít nhất {#limit}",
      "number.max": "Số ngày không được vượt quá {#limit}",
    }),
  }),
};

const historyBased = {};

const trackClick = {
  body: Joi.object({
    room_type_id: Joi.number().integer().positive().required().messages({
      "number.base": "Room type ID phải là số",
      "number.integer": "Room type ID phải là số nguyên",
      "number.positive": "Room type ID phải là số dương",
      "any.required": "Room type ID là bắt buộc",
    }),
  }),
};

const stats = {
  query: Joi.object({
    from: Joi.date().iso().optional().messages({
      "date.format": "Ngày bắt đầu phải đúng định dạng ISO",
    }),
    to: Joi.date().iso().optional().messages({
      "date.format": "Ngày kết thúc phải đúng định dạng ISO",
    }),
  }),
};

module.exports = {
  chat,
  recommendations,
  trending,
  historyBased,
  trackClick,
  stats,
};
