const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('./auth.model');

const SALT_ROUNDS = 10;

const register = async ({ email, password }) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ email, passwordHash });

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: { id: user.id, email: user.email, created_at: user.created_at },
    token,
  };
};

module.exports = {
  register,
  login,
};
