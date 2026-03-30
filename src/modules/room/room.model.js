const pool = require('../../config/db');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('room.model');

const buildRoomFilters = ({ minPrice, maxPrice, guests, amenities, checkIn, checkOut }) => {
  const filters = [];
  const values = [];
  let joinAmenities = false;
  let amenitiesCount = 0;
  let hasDateFilter = false;

  if (checkIn !== undefined && checkOut !== undefined) {
    hasDateFilter = true;
    values.push(checkIn);
    values.push(checkOut);
  }

  if (minPrice !== undefined) {
    values.push(Number(minPrice));
    filters.push('r.price_per_night >= $' + values.length);
  }

  if (maxPrice !== undefined) {
    values.push(Number(maxPrice));
    filters.push('r.price_per_night <= $' + values.length);
  }

  if (guests !== undefined) {
    values.push(Number(guests));
    filters.push('r.max_guests >= $' + values.length);
  }

  if (amenities && amenities.length > 0) {
    joinAmenities = true;
    values.push(amenities);
    amenitiesCount = amenities.length;
  }

  return {
    filters,
    values,
    joinAmenities,
    amenitiesCount,
    hasDateFilter,
  };
};

const getRooms = async ({ minPrice, maxPrice, guests, amenities, checkIn, checkOut, page = 1, limit = 10 }) => {
  log.info('getRooms: building query', { minPrice, maxPrice, guests, page, limit });
  const filterAmenities = amenities ? amenities.split(',').map((item) => item.trim()).filter(Boolean) : [];
  const { filters, values, joinAmenities, amenitiesCount, hasDateFilter } = buildRoomFilters({
    minPrice,
    maxPrice,
    guests,
    amenities: filterAmenities,
    checkIn,
    checkOut,
  });

  const amenityJoin = joinAmenities
    ? 'JOIN hotel.room_amenities ra ON ra.room_type_id = r.id JOIN hotel.amenities a ON a.id = ra.amenity_id'
    : 'LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id';

  let bookingJoin = '';
  let availableSelect = '';
  let havingAvailable = '';

  if (hasDateFilter) {
    bookingJoin = `LEFT JOIN booking.bookings b
      ON b.room_type_id = r.id
      AND b.status IN ('PENDING', 'CONFIRMED', 'PAID')
      AND NOT (b.check_out <= $1 OR b.check_in >= $2)`;
    availableSelect = ',\n      r.total_quantity - COUNT(DISTINCT b.id) AS available_quantity';
    havingAvailable = 'HAVING r.total_quantity - COUNT(DISTINCT b.id) > 0';
  }

  let havingClause = '';
  if (joinAmenities) {
    values.push(amenitiesCount);
    const amenitiesHaving = 'COUNT(DISTINCT a.name) = $' + values.length;
    filters.push('a.name = ANY($' + (values.length - 1) + ')');
    if (hasDateFilter) {
      havingClause = havingAvailable + ' AND ' + amenitiesHaving;
    } else {
      havingClause = 'HAVING ' + amenitiesHaving;
    }
  } else if (hasDateFilter) {
    havingClause = havingAvailable;
  }

  const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

  const offset = (page - 1) * limit;
  values.push(limit);
  const limitParam = '$' + values.length;
  values.push(offset);
  const offsetParam = '$' + values.length;

  const query = `
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
      h.name AS hotel_name,
      h.address AS hotel_address,
      COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities,
      COUNT(*) OVER() AS total_count
      ${availableSelect}
    FROM hotel.room_types r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    ${amenityJoin}
    ${bookingJoin}
    ${whereClause}
    GROUP BY r.id, h.name, h.address
    ${havingClause}
    ORDER BY r.created_at DESC
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const result = await pool.query(query, values);
  const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  const rooms = result.rows.map(({ total_count, ...room }) => room);
  log.info('getRooms: done', { total });
  return { rooms, total };
};

const createRoom = async ({
  hotel_id,
  name,
  price_per_night,
  max_guests,
  description,
  amenities,
  total_quantity,
}) => {
  log.info('createRoom: starting transaction', { hotel_id, name });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const roomResult = await client.query(
      `
        INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, hotel_id, name, price_per_night, max_guests, description, total_quantity, created_at
      `,
      [hotel_id, name, price_per_night, max_guests, description, total_quantity],
    );

    const room = roomResult.rows[0];
    log.info('createRoom: room inserted, processing amenities', { roomId: room.id });
    const amenityNames = amenities.map((item) => item.trim()).filter(Boolean);

    const amenityIds = [];
    for (const amenity of amenityNames) {
      const amenityResult = await client.query(
        `
          INSERT INTO hotel.amenities (name)
          VALUES ($1)
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `,
        [amenity],
      );
      amenityIds.push(amenityResult.rows[0].id);
    }

    for (const amenityId of amenityIds) {
      await client.query(
        `
          INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `,
        [room.id, amenityId],
      );
    }

    await client.query('COMMIT');
    log.info('createRoom: done', { roomId: room.id });

    return {
      ...room,
      amenities: amenityNames,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    log.error('createRoom: failed', error);
    throw error;
  } finally {
    client.release();
  }
};

const getRoomById = async (roomId) => {
  log.info('getRoomById: querying', { roomId });
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
        COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities
      FROM hotel.room_types r
      LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
      LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
      WHERE r.id = $1
      GROUP BY r.id
    `,
    [roomId],
  );
  log.info('getRoomById: done', { roomId, found: !!result.rows[0] });
  return result.rows[0] || null;
};

const updateRoom = async (roomId, { name, price_per_night, max_guests, description, amenities }) => {
  log.info('updateRoom: starting transaction', { roomId });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fields.push('name = $' + paramIndex++);
      values.push(name);
    }
    if (price_per_night !== undefined) {
      fields.push('price_per_night = $' + paramIndex++);
      values.push(price_per_night);
    }
    if (max_guests !== undefined) {
      fields.push('max_guests = $' + paramIndex++);
      values.push(max_guests);
    }
    if (description !== undefined) {
      fields.push('description = $' + paramIndex++);
      values.push(description);
    }

    if (fields.length > 0) {
      values.push(roomId);
      await client.query(
        'UPDATE hotel.room_types SET ' + fields.join(', ') + ' WHERE id = $' + paramIndex,
        values,
      );
    }

    if (amenities !== undefined) {
      await client.query(
        'DELETE FROM hotel.room_amenities WHERE room_type_id = $1',
        [roomId],
      );

      const amenityNames = amenities.map((item) => item.trim()).filter(Boolean);

      for (const amenity of amenityNames) {
        const amenityResult = await client.query(
          `
            INSERT INTO hotel.amenities (name)
            VALUES ($1)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
          `,
          [amenity],
        );

        await client.query(
          `
            INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `,
          [roomId, amenityResult.rows[0].id],
        );
      }
    }

    await client.query('COMMIT');
    log.info('updateRoom: committed, fetching updated room', { roomId });

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
          COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities
        FROM hotel.room_types r
        LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
        LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
        WHERE r.id = $1
        GROUP BY r.id
      `,
      [roomId],
    );

    log.info('updateRoom: done', { roomId });
    return result.rows[0] || null;
  } catch (error) {
    await client.query('ROLLBACK');
    log.error('updateRoom: failed', error);
    throw error;
  } finally {
    client.release();
  }
};

const hasActiveBookingsForRoom = async (roomId) => {
  log.info('hasActiveBookingsForRoom: checking', { roomId });
  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS count
      FROM booking.bookings
      WHERE room_type_id = $1
        AND status IN ('PENDING', 'CONFIRMED', 'PAID')
    `,
    [roomId],
  );
  const hasActive = result.rows[0].count > 0;
  log.info('hasActiveBookingsForRoom: done', { roomId, hasActive });
  return hasActive;
};

const deleteRoom = async (roomId) => {
  log.info('deleteRoom: starting transaction', { roomId });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'DELETE FROM hotel.room_amenities WHERE room_type_id = $1',
      [roomId],
    );

    await client.query(
      'DELETE FROM hotel.room_types WHERE id = $1',
      [roomId],
    );

    await client.query('COMMIT');
    log.info('deleteRoom: done', { roomId });
  } catch (error) {
    await client.query('ROLLBACK');
    log.error('deleteRoom: failed', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getRooms,
  createRoom,
  getRoomById,
  updateRoom,
  hasActiveBookingsForRoom,
  deleteRoom,
};