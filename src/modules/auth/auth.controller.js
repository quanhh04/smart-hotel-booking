/**
 * auth.controller — Tầng nhận request HTTP cho module Auth.
 *
 * Endpoints (mount tại /auth trong app.js):
 *   POST   /auth/register         → register         — Đăng ký user mới
 *   POST   /auth/login            → login            — Đăng nhập, trả JWT
 *   GET    /auth/me               → me               — Lấy thông tin user hiện tại
 *   PUT    /auth/profile          → updateProfile    — Cập nhật display_name, phone
 *   PUT    /auth/change-password  → changePassword   — Đổi mật khẩu (cần mật khẩu cũ)
 *   POST   /auth/forgot-password  → forgotPassword   — Reset password, gửi email
 *
 * Quy ước: controller chỉ "đọc-bóc" req → gọi service → res.json(...).
 * Mọi business logic nằm ở service. Mọi câu SQL nằm ở model.
 */
const authService = require('./auth.service');
const { asyncHandler } = require('../../common/helpers/controller');

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.register(email, password);
  return res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  return res.status(200).json(token);
});

const me = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.userId);
  return res.status(200).json(profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { display_name: displayName, phone } = req.body;
  const profile = await authService.updateProfile(req.user.userId, { displayName, phone });
  return res.status(200).json(profile);
});

const changePassword = asyncHandler(async (req, res) => {
  const { old_password: oldPassword, new_password: newPassword } = req.body;
  await authService.changePassword(req.user.userId, oldPassword, newPassword);
  return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  return res.status(200).json({ message: 'Nếu email tồn tại, chúng tôi đã gửi mật khẩu mới qua email' });
});

module.exports = { register, login, me, updateProfile, changePassword, forgotPassword };
