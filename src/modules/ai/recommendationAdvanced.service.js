const pool = require('../../config/db');

const MAX_PRICE_SCORE = 40;
const MAX_GUEST_SCORE = 20;
const MAX_AMENITY_SCORE = 25;
const MAX_POPULARITY_SCORE = 15;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseAmenityList = (amenities) => {
  if (!amenities) {
    return [];
  }

  return amenities
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
};

const getAdvancedRecommendations = async ({ guests, maxPrice, amenities, limit = 5 }) => {
  const requestedAmenities = parseAmenityList(amenities);

  const params = [];
  const conditions = [];

  if (Number.isInteger(guests) && guests > 0) {
    params.push(guests);
    conditions.push(`r.max_guests >= $${params.length}`);
  }

  if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice) && maxPrice > 0) {
    params.push(maxPrice);
    conditions.push(`r.price_per_night <= $${params.length}`);
  }

  const query = `
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      h.id AS hotel_id,
      h.name AS hotel_name,
      r.price_per_night,
      r.max_guests,
      COALESCE(
        ARRAY_AGG(DISTINCT LOWER(a.name)) FILTER (WHERE a.name IS NOT NULL),
        ARRAY[]::text[]
      ) AS amenities,
      COALESCE(bc.booking_count, 0) AS booking_count
    FROM hotel.room_types r
    INNER JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    LEFT JOIN (
      SELECT
        b.room_type_id,
        COUNT(*)::int AS booking_count
      FROM booking.bookings b
      WHERE UPPER(b.status) = 'PAID'
      GROUP BY b.room_type_id
    ) bc ON bc.room_type_id = r.id
    ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
    GROUP BY r.id, h.id, bc.booking_count
  `;

  const { rows } = await pool.query(query, params);

  if (rows.length === 0) {
    return [];
  }

  const maxBookingCount = Math.max(...rows.map((room) => Number(room.booking_count) || 0), 1);
  const maxObservedPrice = Math.max(...rows.map((room) => Number(room.price_per_night) || 0), 1);

  const scoredRooms = rows
    .map((room) => {
      const roomPrice = Number(room.price_per_night) || 0;
      const roomGuests = Number(room.max_guests) || 0;
      const bookingCount = Number(room.booking_count) || 0;
      const roomAmenities = Array.isArray(room.amenities) ? room.amenities : [];

      let priceScore = 0;
      if (typeof maxPrice === 'number' && !Number.isNaN(maxPrice) && maxPrice > 0) {
        const priceRatio = clamp((maxPrice - roomPrice) / maxPrice, 0, 1);
        priceScore = priceRatio * MAX_PRICE_SCORE;
      } else {
        const fallbackPriceRatio = clamp((maxObservedPrice - roomPrice) / maxObservedPrice, 0, 1);
        priceScore = fallbackPriceRatio * MAX_PRICE_SCORE;
      }

      let guestScore = MAX_GUEST_SCORE;
      if (Number.isInteger(guests) && guests > 0) {
        if (roomGuests < guests) {
          guestScore = 0;
        } else {
          guestScore = clamp(guests / roomGuests, 0, 1) * MAX_GUEST_SCORE;
        }
      }

      let amenityScore = MAX_AMENITY_SCORE;
      if (requestedAmenities.length > 0) {
        const matches = requestedAmenities.filter((amenity) => roomAmenities.includes(amenity)).length;
        amenityScore = (matches / requestedAmenities.length) * MAX_AMENITY_SCORE;
      }

      const popularityScore = (bookingCount / maxBookingCount) * MAX_POPULARITY_SCORE;
      const totalScore = priceScore + guestScore + amenityScore + popularityScore;

      return {
        room_id: room.room_id,
        room_name: room.room_name,
        hotel_id: room.hotel_id,
        hotel_name: room.hotel_name,
        price_per_night: roomPrice,
        score: Number(totalScore.toFixed(2)),
        why: {
          priceScore: Number(priceScore.toFixed(2)),
          guestScore: Number(guestScore.toFixed(2)),
          amenityScore: Number(amenityScore.toFixed(2)),
          popularityScore: Number(popularityScore.toFixed(2)),
        },
        amenities: roomAmenities,
      };
    })
    .sort((first, second) => second.score - first.score);

  const hotelCount = new Map();
  const diversified = [];

  for (const room of scoredRooms) {
    const currentHotelCount = hotelCount.get(room.hotel_id) || 0;

    if (currentHotelCount >= 2) {
      continue;
    }

    diversified.push(room);
    hotelCount.set(room.hotel_id, currentHotelCount + 1);

    if (diversified.length >= limit) {
      break;
    }
  }

  return diversified;
};

module.exports = {
  getAdvancedRecommendations,
};
