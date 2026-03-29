const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');
const { createError } = require('../../common/helpers/error');
const emailService = require('../notification/email.service');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('auth.service');

const register = async (email, password) => {
  log.info('register: checking existing email', { email });
  const existingUser = await authModel.findUserByEmail(email);
  if (existingUser) {
    throw createError('Email đã được sử dụng', 409);
  }

  log.info('register: hashing password');
  const hashedPassword = await bcrypt.hash(password, 10);

  log.info('register: creating user');
  const user = await authModel.createUser({ email, password: hashedPassword, role: 'user' });
  log.info('register: done', { userId: user.id });
  return user;
};

const login = async (email, password) => {
  log.info('login: finding user', { email });
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    throw createError('Email hoặc mật khẩu không đúng', 401);
  }

  log.info('login: comparing password');
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createError('Email hoặc mật khẩu không đúng', 401);
  }

  log.info('login: signing JWT', { userId: user.id });
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  log.info('login: done', { userId: user.id });
  return { token };
};

const getProfile = async (userId) => {
  log.info('getProfile: finding user', { userId });
  const user = await authModel.findUserById(userId);
  if (!user) {
    throw createError('Không tìm thấy người dùng', 404);
  }
  const { password, ...profile } = user;
  log.info('getProfile: done', { userId });
  return profile;
};

const updateProfile = async (userId, { displayName, phone }) => {
  log.info('updateProfile: updating', { userId });
  const profile = await authModel.updateUserProfile(userId, { displayName, phone });
  if (!profile) {
    throw createError('Không tìm thấy người dùng', 404);
  }
  log.info('updateProfile: done', { userId });
  return profile;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  log.info('changePassword: finding user', { userId });
  const user = await authModel.findUserById(userId);
  if (!user) {
    throw createError('Không tìm thấy người dùng', 404);
  }

  log.info('changePassword: comparing old password');
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    throw createError('Mật khẩu hiện tại không đúng', 401);
  }

  log.info('changePassword: hashing new password');
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authModel.updateUserPassword(userId, hashedPassword);
  log.info('changePassword: done', { userId });
};

const forgotPassword = async (email) => {
  log.info('forgotPassword: finding user', { email });
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    log.info('forgotPassword: user not found, skipping');
    return;
  }

  log.info('forgotPassword: generating new password');
  const newPassword = crypto.randomBytes(4).toString('hex');
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authModel.updateUserPassword(user.id, hashedPassword);

  log.info('forgotPassword: sending email');
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
    log.info('forgotPassword: email sent', { email });
  } catch (error) {
    log.error(`forgotPassword: failed to send email to ${email}`, error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
};
