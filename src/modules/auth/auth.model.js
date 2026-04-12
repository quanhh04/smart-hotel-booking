const pool = require('../../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, email, password, role, created_at FROM auth.users WHERE email = $1',
    [email],
  );
  return result.rows[0] || null;
};

const findUserById = async (userId) => {
  const result = await pool.query(
    'SELECT id, email, password, role, display_name, phone, created_at FROM auth.users WHERE id = $1',
    [userId],
  );
  return result.rows[0] || null;
};

const createUser = async ({ email, password, role }) => {
  const result = await pool.query(
    `INSERT INTO auth.users (email, password, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role, created_at`,
    [email, password, role],
  );
  return result.rows[0];
};

const updateUserProfile = async (userId, { displayName, phone }) => {
  const result = await pool.query(
    `UPDATE auth.users SET display_name = $1, phone = $2 WHERE id = $3
     RETURNING id, email, role, display_name, phone, created_at`,
    [displayName, phone, userId],
  );
  return result.rows[0] || null;
};

const updateUserPassword = async (userId, hashedPassword) => {
  await pool.query('UPDATE auth.users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
};

module.exports = { findUserByEmail, findUserById, createUser, updateUserProfile, updateUserPassword };
