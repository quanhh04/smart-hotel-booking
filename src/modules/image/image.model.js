const pool = require('../../config/db');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('image.model');

const createImage = async ({ url, alt, type }) => {
  log.info('createImage', { type });
  const result = await pool.query(
    'INSERT INTO settings.images (url, alt, type) VALUES ($1, $2, $3) RETURNING *',
    [url, alt || null, type || 'hotel'],
  );
  return result.rows[0];
};

const getImageById = async (id) => {
  const result = await pool.query('SELECT * FROM settings.images WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const deleteImage = async (id) => {
  await pool.query('DELETE FROM settings.images WHERE id = $1', [id]);
};

const getImages = async ({ type, limit = 50 }) => {
  const result = await pool.query(
    'SELECT * FROM settings.images WHERE ($1::text IS NULL OR type = $1) ORDER BY created_at DESC LIMIT $2',
    [type || null, limit],
  );
  return result.rows;
};

// Hotel-Image mapping
const addHotelImage = async (hotelId, imageId, sortOrder = 0) => {
  log.info('addHotelImage', { hotelId, imageId });
  await pool.query(
    'INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES ($1, $2, $3) ON CONFLICT (hotel_id, image_id) DO UPDATE SET sort_order = $3',
    [hotelId, imageId, sortOrder],
  );
};

const removeHotelImage = async (hotelId, imageId) => {
  log.info('removeHotelImage', { hotelId, imageId });
  await pool.query('DELETE FROM hotel.hotel_images WHERE hotel_id = $1 AND image_id = $2', [hotelId, imageId]);
};

const getHotelImages = async (hotelId) => {
  const result = await pool.query(
    `SELECT i.id, i.url, i.alt, hi.sort_order
     FROM settings.images i
     JOIN hotel.hotel_images hi ON hi.image_id = i.id
     WHERE hi.hotel_id = $1
     ORDER BY hi.sort_order ASC, i.id ASC`,
    [hotelId],
  );
  return result.rows;
};

module.exports = { createImage, getImageById, deleteImage, getImages, addHotelImage, removeHotelImage, getHotelImages };
