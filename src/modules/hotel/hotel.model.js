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

      COALESCE(img.url, '[]'::jsonb) AS images,

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
    LEFT JOIN hotel.cities c ON c.id = h.city_id
    LEFT JOIN hotel.images img ON img.hotel_id = h.id
    LEFT JOIN hotel.rooms r ON r.hotel_id = h.id
    WHERE h.id = $1
    GROUP BY h.id, c.id, img.url
    `,
    [hotelId],
  );

  return result.rows[0] || null;
};

module.exports = {
  getHotels,
  createHotel,
  getHotelDetailById,
};
