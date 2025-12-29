const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createUser = async ({ email, passwordHash }) => {
  const query = {
    text: `
      INSERT INTO auth.users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at
    `,
    values: [email, passwordHash],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = {
    text: `
      SELECT id, email, password_hash, created_at
      FROM auth.users
      WHERE email = $1
    `,
    values: [email],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

module.exports = {
  pool,
  createUser,
  getUserByEmail,
};
