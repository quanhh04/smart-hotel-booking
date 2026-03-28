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

const updateProfile = {
  body: Joi.object({
    display_name: Joi.string().max(100).messages({
      "string.base": "Tên hiển thị phải là chuỗi ký tự",
      "string.max": "Tên hiển thị không được vượt quá {#limit} ký tự",
    }),
    phone: Joi.string().max(20).messages({
      "string.base": "Số điện thoại phải là chuỗi ký tự",
      "string.max": "Số điện thoại không được vượt quá {#limit} ký tự",
    }),
  }),
};

const changePassword = {
  body: Joi.object({
    old_password: Joi.string().required().messages({
      "string.base": "Mật khẩu cũ phải là chuỗi ký tự",
      "string.empty": "Mật khẩu cũ không được để trống",
      "any.required": "Mật khẩu cũ là bắt buộc",
    }),
    new_password: Joi.string().min(6).required().messages({
      "string.base": "Mật khẩu mới phải là chuỗi ký tự",
      "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
      "string.empty": "Mật khẩu mới không được để trống",
      "any.required": "Mật khẩu mới là bắt buộc",
    }),
  }),
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email phải là chuỗi ký tự",
      "string.email": "Email không đúng định dạng",
      "string.empty": "Email không được để trống",
      "any.required": "Email là bắt buộc",
    }),
  }),
};

module.exports = {
  register,
  login,
  updateProfile,
  changePassword,
  forgotPassword,
};
