const pool = require('../../config/db');

const buildRoomFilters = ({ minPrice, maxPrice, guests, amenities }) => {
  const filters = [];
  const values = [];
  let joinAmenities = false;
  let amenitiesCount = 0;

  if (minPrice !== undefined) {
    values.push(Number(minPrice));
    filters.push(`r.price_per_night >= $${values.length}`);
  }

  if (maxPrice !== undefined) {
    values.push(Number(maxPrice));
    filters.push(`r.price_per_night <= $${values.length}`);
  }

  if (guests !== undefined) {
    values.push(Number(guests));
    filters.push(`r.max_guests >= $${values.length}`);
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
  };
};

const getRooms = async ({ minPrice, maxPrice, guests, amenities }) => {
  const filterAmenities = amenities ? amenities.split(',').map((item) => item.trim()).filter(Boolean) : [];
  const { filters, values, joinAmenities, amenitiesCount } = buildRoomFilters({
    minPrice,
    maxPrice,
    guests,
    amenities: filterAmenities,
  });

  const amenityJoin = joinAmenities
    ? 'JOIN hotel.room_amenities ra ON ra.room_id = r.id JOIN hotel.amenities a ON a.id = ra.amenity_id'
    : 'LEFT JOIN hotel.room_amenities ra ON ra.room_id = r.id LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id';

  let havingClause = '';
  if (joinAmenities) {
    values.push(amenitiesCount);
    havingClause = `HAVING COUNT(DISTINCT a.name) = $${values.length}`;
    filters.push(`a.name = ANY($${values.length - 1})`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const query = `
    SELECT
      r.id,
      r.hotel_id,
      r.name,
      r.price_per_night,
      r.max_guests,
      r.description,
      r.created_at,
      COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities
    FROM hotel.rooms r
    ${amenityJoin}
    ${whereClause}
    GROUP BY r.id
    ${havingClause}
    ORDER BY r.created_at DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

const createRoom = async ({
  hotel_id,
  name,
  price_per_night,
  max_guests,
  description,
  amenities,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const roomResult = await client.query(
      `
        INSERT INTO hotel.rooms (hotel_id, name, price_per_night, max_guests, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, hotel_id, name, price_per_night, max_guests, description, created_at
      `,
      [hotel_id, name, price_per_night, max_guests, description],
    );

    const room = roomResult.rows[0];
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
          INSERT INTO hotel.room_amenities (room_id, amenity_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `,
        [room.id, amenityId],
      );
    }

    await client.query('COMMIT');

    return {
      ...room,
      amenities: amenityNames,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getRooms,
  createRoom,
};
