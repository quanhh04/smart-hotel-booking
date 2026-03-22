const Joi = require("joi");

const register = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email phải là chuỗi ký tự",
      "string.email": "Email không đúng định dạng",
      "string.empty": "Email không được để trống",
      "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Mật khẩu phải là chuỗi ký tự",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
      "string.empty": "Mật khẩu không được để trống",
      "any.required": "Mật khẩu là bắt buộc",
    }),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email phải là chuỗi ký tự",
      "string.email": "Email không đúng định dạng",
      "string.empty": "Email không được để trống",
      "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().required().messages({
      "string.base": "Mật khẩu phải là chuỗi ký tự",
      "string.empty": "Mật khẩu không được để trống",
      "any.required": "Mật khẩu là bắt buộc",
    }),
  }),
};

module.exports = { register, login };
