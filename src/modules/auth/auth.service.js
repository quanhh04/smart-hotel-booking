const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');

const register = async (email, password) => {
  const existingUser = await authModel.findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await authModel.createUser({
    email,
    password: hashedPassword,
    role: 'user',
  });

  return user;
};

const login = async (email, password) => {
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  return { token };
};

module.exports = {
  register,
  login,
};
