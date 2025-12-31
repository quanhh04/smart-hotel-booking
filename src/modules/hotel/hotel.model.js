const pool = require('../../config/db');

const listHotels = async () => {
  const result = await pool.query(
    `
      SELECT id, name, address, description, created_at
      FROM hotel.hotels
      ORDER BY created_at DESC
    `,
  );

  return result.rows;
};

const createHotel = async ({ name, address, description }) => {
  const result = await pool.query(
    `
      INSERT INTO hotel.hotels (name, address, description)
      VALUES ($1, $2, $3)
      RETURNING id, name, address, description, created_at
    `,
    [name, address, description],
  );

  return result.rows[0];
};

module.exports = {
  listHotels,
  createHotel,
};
