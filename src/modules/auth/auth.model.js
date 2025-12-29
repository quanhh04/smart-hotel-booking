const pool = require('../../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT id, email, password, role, created_at
      FROM auth.users
      WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] || null;
};

const createUser = async ({ email, password, role }) => {
  const result = await pool.query(
    `
      INSERT INTO auth.users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, created_at
    `,
    [email, password, role],
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
};
