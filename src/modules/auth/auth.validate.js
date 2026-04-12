const { sendError } = require('../../common/middleware/validate');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /auth/register
 * Body: { email, password }
 */
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return sendError(res, 'Email là bắt buộc');
  if (typeof email !== 'string') return sendError(res, 'Email phải là chuỗi ký tự');
  if (!EMAIL_RE.test(email)) return sendError(res, 'Email không đúng định dạng');

  if (!password) return sendError(res, 'Mật khẩu là bắt buộc');
  if (typeof password !== 'string') return sendError(res, 'Mật khẩu phải là chuỗi ký tự');
  if (password.length < 6) return sendError(res, 'Mật khẩu phải có ít nhất 6 ký tự');

  next();
};

/**
 * POST /auth/login
 * Body: { email, password }
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return sendError(res, 'Email là bắt buộc');
  if (typeof email !== 'string') return sendError(res, 'Email phải là chuỗi ký tự');
  if (!EMAIL_RE.test(email)) return sendError(res, 'Email không đúng định dạng');

  if (!password) return sendError(res, 'Mật khẩu là bắt buộc');
  if (typeof password !== 'string') return sendError(res, 'Mật khẩu phải là chuỗi ký tự');

  next();
};

/**
 * PUT /auth/profile
 * Body: { display_name?, phone? }
 */
const validateUpdateProfile = (req, res, next) => {
  const { display_name, phone } = req.body;

  if (display_name !== undefined) {
    if (typeof display_name !== 'string') return sendError(res, 'Tên hiển thị phải là chuỗi ký tự');
    if (display_name.length > 100) return sendError(res, 'Tên hiển thị không được vượt quá 100 ký tự');
  }

  if (phone !== undefined) {
    if (typeof phone !== 'string') return sendError(res, 'Số điện thoại phải là chuỗi ký tự');
    if (phone.length > 20) return sendError(res, 'Số điện thoại không được vượt quá 20 ký tự');
  }

  next();
};

/**
 * PUT /auth/change-password
 * Body: { old_password, new_password }
 */
const validateChangePassword = (req, res, next) => {
  const { old_password, new_password } = req.body;

  if (!old_password) return sendError(res, 'Mật khẩu cũ là bắt buộc');
  if (typeof old_password !== 'string') return sendError(res, 'Mật khẩu cũ phải là chuỗi ký tự');

  if (!new_password) return sendError(res, 'Mật khẩu mới là bắt buộc');
  if (typeof new_password !== 'string') return sendError(res, 'Mật khẩu mới phải là chuỗi ký tự');
  if (new_password.length < 6) return sendError(res, 'Mật khẩu mới phải có ít nhất 6 ký tự');

  next();
};

/**
 * POST /auth/forgot-password
 * Body: { email }
 */
const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) return sendError(res, 'Email là bắt buộc');
  if (typeof email !== 'string') return sendError(res, 'Email phải là chuỗi ký tự');
  if (!EMAIL_RE.test(email)) return sendError(res, 'Email không đúng định dạng');

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateForgotPassword,
};
