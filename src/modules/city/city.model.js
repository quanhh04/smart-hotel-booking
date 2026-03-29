const pool = require('../../config/db');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('city.model');

const getCities = async ({ limit = 10 } = {}) => {
  log.info('getCities: querying');
  const result = await pool.query(
    `SELECT c.id, c.name, c.subtitle, c.thumbnail, c.created_at,
            COUNT(h.id)::int AS hotel_count
     FROM hotel.cities c
     LEFT JOIN hotel.hotels h ON LOWER(h.address) LIKE '%' || LOWER(c.name) || '%'
     GROUP BY c.id
     ORDER BY hotel_count DESC, c.name ASC
     LIMIT $1`,
    [limit],
  );
  log.info('getCities: done', { count: result.rows.length });
  return result.rows;
};

const getCityById = async (id) => {
  log.info('getCityById: querying', { id });
  const result = await pool.query(
    `SELECT c.id, c.name, c.subtitle, c.thumbnail, c.created_at,
            COUNT(h.id)::int AS hotel_count
     FROM hotel.cities c
     LEFT JOIN hotel.hotels h ON LOWER(h.address) LIKE '%' || LOWER(c.name) || '%'
     WHERE c.id = $1
     GROUP BY c.id`,
    [id],
  );
  return result.rows[0] || null;
};

const createCity = async ({ name, subtitle, thumbnail }) => {
  log.info('createCity: inserting', { name });
  const result = await pool.query(
    `INSERT INTO hotel.cities (name, subtitle, thumbnail)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, subtitle || null, thumbnail || null],
  );
  return result.rows[0];
};

const updateCity = async (id, { name, subtitle, thumbnail }) => {
  log.info('updateCity: updating', { id });
  const fields = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
  if (subtitle !== undefined) { fields.push(`subtitle = $${idx++}`); values.push(subtitle); }
  if (thumbnail !== undefined) { fields.push(`thumbnail = $${idx++}`); values.push(thumbnail); }

  if (!fields.length) return getCityById(id);

  values.push(id);
  const result = await pool.query(
    `UPDATE hotel.cities SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return result.rows[0] || null;
};

const deleteCity = async (id) => {
  log.info('deleteCity: deleting', { id });
  await pool.query('DELETE FROM hotel.cities WHERE id = $1', [id]);
};

module.exports = { getCities, getCityById, createCity, updateCity, deleteCity };
