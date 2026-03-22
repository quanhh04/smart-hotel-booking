const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');
const { createError } = require('../../common/helpers/error');

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
    { expiresIn: '1h' },
  );

  return { token };
};

module.exports = {
  register,
  login,
};
