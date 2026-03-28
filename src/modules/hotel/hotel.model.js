const pool = require('../../config/db');

const getHotels = async () => {
  const result = await pool.query(
    `
      SELECT id, name, address, description, created_at
      FROM hotel.hotels
      ORDER BY created_at DESC
    `,
  );

  return result.rows;
};

const ALLOWED_SORT_COLUMNS = ['rating', 'price_from', 'created_at'];

const searchHotels = async ({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit }) => {
  const filters = [];
  const values = [];

  if (keyword !== undefined) {
    values.push('%' + keyword + '%');
    filters.push('(h.name ILIKE $' + values.length + ' OR h.address ILIKE $' + values.length + ')');
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
      h.discount_percent,
      h.created_at,
      COUNT(*) OVER() AS total
    FROM hotel.hotels h
    ${whereClause}
    ORDER BY h.${sortColumn} ${order}
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const result = await pool.query(query, values);
  const total = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
  const hotels = result.rows.map(({ total: _total, ...hotel }) => hotel);

  return { hotels, total };
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

const getHotelDetailById = async (hotelId) => {
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
    h.discount_percent,

    COALESCE(
      (SELECT jsonb_agg(img.url) FROM hotel.images img WHERE img.hotel_id = h.id),
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

  return result.rows[0] || null;
};

const updateHotel = async (hotelId, { name, address, description }) => {
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

  return result.rows[0] || null;
};

const hasActiveBookings = async (hotelId) => {
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

  return result.rows[0].count > 0;
};

const deleteHotel = async (hotelId) => {
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
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const addHotelImage = async (hotelId, url) => {
  const existing = await pool.query(
    'SELECT id FROM hotel.images WHERE hotel_id = $1',
    [hotelId],
  );

  if (existing.rows.length > 0) {
    const result = await pool.query(
      `UPDATE hotel.images
       SET url = url || $2::jsonb
       WHERE hotel_id = $1
       RETURNING url`,
      [hotelId, JSON.stringify([url])],
    );
    return result.rows[0].url;
  }

  const result = await pool.query(
    `INSERT INTO hotel.images (hotel_id, url)
     VALUES ($1, $2::jsonb)
     RETURNING url`,
    [hotelId, JSON.stringify([url])],
  );
  return result.rows[0].url;
};

const deleteHotelImage = async (hotelId, imageIndex) => {
  const result = await pool.query(
    `UPDATE hotel.images
     SET url = url - $2::int
     WHERE hotel_id = $1
     RETURNING url`,
    [hotelId, imageIndex],
  );
  return result.rows[0] ? result.rows[0].url : null;
};

const getHotelById = async (hotelId) => {
  const result = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [hotelId],
  );
  return result.rows[0] || null;
};

const getRoomsByHotelId = async ({ hotelId, page = 1, limit = 10 }) => {
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
  addHotelImage,
  deleteHotelImage,
  getRoomsByHotelId,
  getHotelById,
};
