const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');
const { createError } = require('../../common/helpers/error');
const emailService = require('../notification/email.service');

const register = async (email, password) => {
  const existingUser = await authModel.findUserByEmail(email);
  if (existingUser) {
    throw createError('Email đã được sử dụng', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return authModel.createUser({ email, password: hashedPassword, role: 'user' });
};

const login = async (email, password) => {
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    throw createError('Email hoặc mật khẩu không đúng', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createError('Email hoặc mật khẩu không đúng', 401);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return { token };
};

const updateProfile = async (userId, { displayName, phone }) => {
  const profile = await authModel.updateUserProfile(userId, { displayName, phone });
  if (!profile) {
    throw createError('Không tìm thấy người dùng', 404);
  }
  return profile;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await authModel.findUserById(userId);
  if (!user) {
    throw createError('Không tìm thấy người dùng', 404);
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    throw createError('Mật khẩu hiện tại không đúng', 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authModel.updateUserPassword(userId, hashedPassword);
};

const forgotPassword = async (email) => {
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    return;
  }

  const newPassword = crypto.randomBytes(4).toString('hex'); // 8 ký tự random
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authModel.updateUserPassword(user.id, hashedPassword);

  try {
    const transport = await emailService.getTransporter();
    await transport.sendMail({
      from: process.env.SMTP_FROM || 'noreply@smarthotel.com',
      to: email,
      subject: 'Mật khẩu mới của bạn',
      html: `
        <h2>Mật khẩu mới</h2>
        <p>Mật khẩu của bạn đã được đặt lại. Mật khẩu mới của bạn là:</p>
        <p style="font-size: 18px; font-weight: bold; background: #f0f0f0; padding: 10px; display: inline-block;">${newPassword}</p>
        <p>Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.</p>
      `,
    });
  } catch (error) {
    console.error(`Failed to send new password email to ${email}:`, error.message);
  }
};

const getProfile = async (userId) => {
  const user = await authModel.findUserById(userId);
  if (!user) {
    throw createError('Không tìm thấy người dùng', 404);
  }
  const { password, ...profile } = user;
  return profile;
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
};
