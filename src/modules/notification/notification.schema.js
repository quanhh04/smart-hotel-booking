const Joi = require("joi");

const getNotifications = {
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

const markAsRead = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID thông báo phải là số",
      "number.integer": "ID thông báo phải là số nguyên",
      "number.positive": "ID thông báo phải là số dương",
      "any.required": "ID thông báo là bắt buộc",
    }),
  }),
};

const deleteNotification = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": "ID thông báo phải là số",
      "number.integer": "ID thông báo phải là số nguyên",
      "number.positive": "ID thông báo phải là số dương",
      "any.required": "ID thông báo là bắt buộc",
    }),
  }),
};

const createSystemNotification = {
  body: Joi.object({
    title: Joi.string().max(200).required().messages({
      "string.base": "Tiêu đề phải là chuỗi",
      "string.empty": "Tiêu đề không được để trống",
      "string.max": "Tiêu đề không được vượt quá 200 ký tự",
      "any.required": "Tiêu đề là bắt buộc",
    }),
    message: Joi.string().max(2000).required().messages({
      "string.base": "Nội dung phải là chuỗi",
      "string.empty": "Nội dung không được để trống",
      "string.max": "Nội dung không được vượt quá 2000 ký tự",
      "any.required": "Nội dung là bắt buộc",
    }),
  }),
};

module.exports = { getNotifications, markAsRead, deleteNotification, createSystemNotification };
