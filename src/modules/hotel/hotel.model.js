const pool = require('../../config/db');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('hotel.model');

const getHotels = async () => {
  log.info('getHotels: querying all hotels');
  const result = await pool.query(
    `
      SELECT id, name, address, description, created_at
      FROM hotel.hotels
      ORDER BY created_at DESC
    `,
  );
  log.info('getHotels: done', { count: result.rows.length });
  return result.rows;
};

const ALLOWED_SORT_COLUMNS = ['rating', 'price_from', 'created_at'];

const searchHotels = async ({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit }) => {
  log.info('searchHotels: building query', { keyword, minPrice, maxPrice, stars, page, limit });
  const filters = [];
  const values = [];

  if (keyword !== undefined) {
    values.push('%' + keyword + '%');
    filters.push('(unaccent(h.name) ILIKE unaccent($' + values.length + ') OR unaccent(h.address) ILIKE unaccent($' + values.length + '))');
  }

  if (minPrice !== undefined) {
    values.push(Number(minPrice));
    filters.push('h.price_from >= $' + values.length);
  }

  if (maxPrice !== undefined) {
    values.push(Number(maxPrice));
    filters.push('h.price_from <= $' + values.length);
  }

  if (stars !== undefined) {
    values.push(Number(stars));
    filters.push('h.stars = $' + values.length);
  }

  const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

  const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const offset = (currentPage - 1) * currentLimit;

  values.push(currentLimit);
  const limitParam = '$' + values.length;
  values.push(offset);
  const offsetParam = '$' + values.length;

  const query = `
    SELECT
      h.id,
      h.name,
      h.address,
      h.description,
      h.rating,
      h.reviews,
      h.price_from,
      h.stars,
      h.created_at,
      COALESCE(
        (SELECT jsonb_agg(si.url ORDER BY hi.sort_order) FROM hotel.hotel_images hi JOIN settings.images si ON si.id = hi.image_id WHERE hi.hotel_id = h.id),
        '[]'::jsonb
      ) AS images,
      COUNT(*) OVER() AS total
    FROM hotel.hotels h
    ${whereClause}
    ORDER BY h.${sortColumn} ${order}
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const result = await pool.query(query, values);
  const total = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
  const hotels = result.rows.map(({ total: _total, ...hotel }) => hotel);
  log.info('searchHotels: done', { total });
  return { hotels, total };
};

const createHotel = async ({ name, address, description }) => {
  log.info('createHotel: inserting hotel', { name });
  const result = await pool.query(
    `
      INSERT INTO hotel.hotels (name, address, description)
      VALUES ($1, $2, $3)
      RETURNING id, name, address, description, created_at
    `,
    [name, address, description],
  );
  log.info('createHotel: done', { hotelId: result.rows[0].id });
  return result.rows[0];
};

const getHotelDetailById = async (hotelId) => {
  log.info('getHotelDetailById: querying', { hotelId });
  const result = await pool.query(
    `
    SELECT
    h.id,
    h.name,
    h.address,
    h.description,
    h.created_at,
    h.rating,
    h.reviews,
    h.price_from,
    h.stars,

    COALESCE(
      (SELECT jsonb_agg(si.url ORDER BY hi.sort_order) FROM hotel.hotel_images hi JOIN settings.images si ON si.id = hi.image_id WHERE hi.hotel_id = h.id),
      '[]'::jsonb
    ) AS images,

    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'name', r.name,
          'pricePerNight', r.price_per_night,
          'maxGuests', r.max_guests,
          'description', r.description
        )
        ORDER BY r.id
      ) FILTER (WHERE r.id IS NOT NULL),
      '[]'::jsonb
    ) AS rooms
  FROM hotel.hotels h
  LEFT JOIN hotel.room_types r ON r.hotel_id = h.id
  WHERE h.id = $1
  GROUP BY h.id
    `,
    [hotelId],
  );
  log.info('getHotelDetailById: done', { hotelId, found: !!result.rows[0] });
  return result.rows[0] || null;
};

const updateHotel = async (hotelId, { name, address, description }) => {
  log.info('updateHotel: building update', { hotelId });
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) {
    fields.push('name = $' + paramIndex++);
    values.push(name);
  }
  if (address !== undefined) {
    fields.push('address = $' + paramIndex++);
    values.push(address);
  }
  if (description !== undefined) {
    fields.push('description = $' + paramIndex++);
    values.push(description);
  }

  if (fields.length === 0) {
    return getHotelDetailById(hotelId);
  }

  values.push(hotelId);

  const result = await pool.query(
    'UPDATE hotel.hotels SET ' + fields.join(', ') + ' WHERE id = $' + paramIndex + ' RETURNING *',
    values,
  );
  log.info('updateHotel: done', { hotelId });
  return result.rows[0] || null;
};

const hasActiveBookings = async (hotelId) => {
  log.info('hasActiveBookings: checking', { hotelId });
  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS count
      FROM booking.bookings b
      JOIN hotel.room_types rt ON rt.id = b.room_type_id
      WHERE rt.hotel_id = $1
        AND b.status IN ('PENDING', 'CONFIRMED', 'PAID')
    `,
    [hotelId],
  );
  const hasActive = result.rows[0].count > 0;
  log.info('hasActiveBookings: done', { hotelId, hasActive });
  return hasActive;
};

const deleteHotel = async (hotelId) => {
  log.info('deleteHotel: starting transaction', { hotelId });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
        DELETE FROM hotel.room_amenities
        WHERE room_type_id IN (
          SELECT id FROM hotel.room_types WHERE hotel_id = $1
        )
      `,
      [hotelId],
    );

    await client.query(
      `
        DELETE FROM hotel.room_types
        WHERE hotel_id = $1
      `,
      [hotelId],
    );

    await client.query(
      `
        DELETE FROM hotel.hotels
        WHERE id = $1
      `,
      [hotelId],
    );

    await client.query('COMMIT');
    log.info('deleteHotel: done', { hotelId });
  } catch (error) {
    await client.query('ROLLBACK');
    log.error('deleteHotel: failed', error);
    throw error;
  } finally {
    client.release();
  }
};

const getHotelById = async (hotelId) => {
  log.info('getHotelById: querying', { hotelId });
  const result = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [hotelId],
  );
  log.info('getHotelById: done', { hotelId, found: !!result.rows[0] });
  return result.rows[0] || null;
};

const getRoomsByHotelId = async ({ hotelId, page = 1, limit = 10 }) => {
  log.info('getRoomsByHotelId: querying', { hotelId, page, limit });
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const offset = (currentPage - 1) * currentLimit;

  const result = await pool.query(
    `
      SELECT
        r.id,
        r.hotel_id,
        r.name,
        r.price_per_night,
        r.max_guests,
        r.description,
        r.bed,
        r.size,
        r.total_quantity,
        r.created_at,
        COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities,
        COUNT(*) OVER() AS total_count
      FROM hotel.room_types r
      LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
      LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
      WHERE r.hotel_id = $1
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `,
    [hotelId, currentLimit, offset],
  );

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  const rooms = result.rows.map(({ total_count, ...room }) => room);
  log.info('getRoomsByHotelId: done', { hotelId, total });
  return { rooms, total };
};

module.exports = {
  getHotels,
  searchHotels,
  createHotel,
  getHotelDetailById,
  updateHotel,
  hasActiveBookings,
  deleteHotel,
  getRoomsByHotelId,
  getHotelById,
};