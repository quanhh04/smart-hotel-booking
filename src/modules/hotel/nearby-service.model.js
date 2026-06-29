const pool = require('../../config/db');

const getNearbyServices = async ({ hotelId, category, limit = 20 }) => {
  const conditions = ['ns.hotel_id = $1'];
  const values = [hotelId];
  let idx = 1;

  if (category) {
    values.push(category);
    conditions.push(`ns.category = $${++idx}`);
  }

  values.push(Math.min(Number(limit) || 20, 50));
  const limitIdx = ++idx;

  const result = await pool.query(
    `SELECT ns.id, ns.hotel_id, ns.category, ns.name, ns.description,
            ns.address, ns.distance, ns.rating, ns.price_range,
            ns.map_url, ns.website_url, ns.tags
     FROM hotel.nearby_services ns
     WHERE ${conditions.join(' AND ')}
     ORDER BY ns.rating DESC NULLS LAST, ns.name
     LIMIT $${limitIdx}`,
    values,
  );

  return result.rows;
};

const getCategories = async (hotelId) => {
  const result = await pool.query(
    `SELECT DISTINCT category, COUNT(*)::int AS count
     FROM hotel.nearby_services
     WHERE hotel_id = $1
     GROUP BY category
     ORDER BY count DESC`,
    [hotelId],
  );
  return result.rows;
};


const getAllNearbyServices = async ({ hotelId, category, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let idx = 0;

  if (hotelId) {
    values.push(Number(hotelId));
    conditions.push(`ns.hotel_id = $${++idx}`);
  }
  if (category) {
    values.push(category);
    conditions.push(`ns.category = $${++idx}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const currentPage = Number(page) || 1;
  const currentLimit = Math.min(Number(limit) || 20, 100);
  const offset = (currentPage - 1) * currentLimit;

  values.push(currentLimit);
  const limitIdx = ++idx;
  values.push(offset);
  const offsetIdx = ++idx;

  const result = await pool.query(
    `SELECT ns.id, ns.hotel_id, ns.category, ns.name, ns.description,
            ns.address, ns.distance, ns.rating, ns.price_range,
            ns.map_url, ns.website_url, ns.tags, ns.created_at,
            h.name AS hotel_name,
            COUNT(*) OVER() AS total
     FROM hotel.nearby_services ns
     JOIN hotel.hotels h ON h.id = ns.hotel_id
     ${where}
     ORDER BY ns.hotel_id, ns.category, ns.name
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    values,
  );

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
  const services = result.rows.map(({ total: _, ...row }) => row);
  return { services, total };
};

const createNearbyService = async (data) => {
  const { hotel_id, category, name, description, address, distance, rating, price_range, map_url, website_url, tags } = data;
  const result = await pool.query(
    `INSERT INTO hotel.nearby_services (hotel_id, category, name, description, address, distance, rating, price_range, map_url, website_url, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [hotel_id, category, name, description || null, address || null, distance || null, rating || null, price_range || null, map_url || null, website_url || null, tags || null],
  );
  return result.rows[0];
};

const updateNearbyService = async (id, data) => {
  const fields = [];
  const values = [];
  let idx = 0;

  const allowedFields = ['hotel_id', 'category', 'name', 'description', 'address', 'distance', 'rating', 'price_range', 'map_url', 'website_url', 'tags'];
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      values.push(data[field]);
      fields.push(`${field} = $${++idx}`);
    }
  }

  if (fields.length === 0) return getById(id);

  values.push(id);
  const result = await pool.query(
    `UPDATE hotel.nearby_services SET ${fields.join(', ')} WHERE id = $${++idx} RETURNING *`,
    values,
  );
  return result.rows[0] || null;
};

const deleteNearbyService = async (id) => {
  const result = await pool.query('DELETE FROM hotel.nearby_services WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM hotel.nearby_services WHERE id = $1', [id]);
  return result.rows[0] || null;
};

module.exports = { getNearbyServices, getCategories, getAllNearbyServices, createNearbyService, updateNearbyService, deleteNearbyService, getById };
