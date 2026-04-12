const pool = require('../../config/db');

const getCities = async ({ limit = 10 } = {}) => {
  const result = await pool.query(
    `SELECT c.id, c.name, c.subtitle, c.thumbnail_id,
            si.url AS thumbnail, c.created_at,
            COUNT(h.id)::int AS hotel_count
     FROM hotel.cities c
     LEFT JOIN settings.images si ON si.id = c.thumbnail_id
     LEFT JOIN hotel.hotels h ON unaccent(LOWER(h.address)) LIKE '%' || unaccent(LOWER(c.name)) || '%'
     GROUP BY c.id, si.url
     ORDER BY hotel_count DESC, c.name ASC
     LIMIT $1`,
    [limit],
  );
  return result.rows;
};

const getCityById = async (id) => {
  const result = await pool.query(
    `SELECT c.id, c.name, c.subtitle, c.thumbnail_id,
            si.url AS thumbnail, c.created_at,
            COUNT(h.id)::int AS hotel_count
     FROM hotel.cities c
     LEFT JOIN settings.images si ON si.id = c.thumbnail_id
     LEFT JOIN hotel.hotels h ON unaccent(LOWER(h.address)) LIKE '%' || unaccent(LOWER(c.name)) || '%'
     WHERE c.id = $1
     GROUP BY c.id, si.url`,
    [id],
  );
  return result.rows[0] || null;
};

const createCity = async ({ name, subtitle, thumbnail_id }) => {
  const result = await pool.query(
    `INSERT INTO hotel.cities (name, subtitle, thumbnail_id) VALUES ($1, $2, $3) RETURNING *`,
    [name, subtitle || null, thumbnail_id || null],
  );
  return result.rows[0];
};

const updateCity = async (id, { name, subtitle, thumbnail_id }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (name !== undefined)         { fields.push(`name = $${idx++}`);         values.push(name); }
  if (subtitle !== undefined)     { fields.push(`subtitle = $${idx++}`);     values.push(subtitle); }
  if (thumbnail_id !== undefined) { fields.push(`thumbnail_id = $${idx++}`); values.push(thumbnail_id); }

  if (!fields.length) return getCityById(id);

  values.push(id);
  const result = await pool.query(
    `UPDATE hotel.cities SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return result.rows[0] || null;
};

const deleteCity = async (id) => {
  await pool.query('DELETE FROM hotel.cities WHERE id = $1', [id]);
};

module.exports = { getCities, getCityById, createCity, updateCity, deleteCity };
