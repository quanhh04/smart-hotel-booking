const pool = require('../../config/db');

const getRecommendations = async ({ guests, maxPrice }) => {
  const query = `
    SELECT
      r.id AS room_id,
      r.name,
      r.price_per_night,
      r.max_guests,
      COUNT(ra.amenity_id) AS amenity_count
    FROM hotel.room_types r
    LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    WHERE r.max_guests >= $1
      AND r.price_per_night <= $2
    GROUP BY r.id, r.name, r.price_per_night, r.max_guests
  `;

  const result = await pool.query(query, [guests, maxPrice]);

  return result.rows
    .map((room) => ({
      room_id: room.room_id,
      name: room.name,
      score:
        (Number(room.price_per_night) <= maxPrice ? 1 : 0) +
        (Number(room.max_guests) >= guests ? 1 : 0) +
        Number(room.amenity_count),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

module.exports = {
  getRecommendations,
};
