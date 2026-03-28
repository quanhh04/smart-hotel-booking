const pool = require('../../config/db');
const { createError } = require('../../common/helpers/error');

const getBookingForReview = async (bookingId) => {
  const result = await pool.query(
    `
      SELECT b.id, b.status, b.check_out, b.user_id, rt.hotel_id
      FROM booking.bookings b
      JOIN hotel.room_types rt ON rt.id = b.room_type_id
      WHERE b.id = $1
    `,
    [bookingId],
  );

  return result.rows[0] || null;
};

const getExistingReview = async (bookingId) => {
  const result = await pool.query(
    `
      SELECT id, booking_id, user_id, hotel_id, rating, comment, created_at, updated_at
      FROM booking.reviews
      WHERE booking_id = $1
    `,
    [bookingId],
  );

  return result.rows[0] || null;
};

const getReviewById = async (reviewId) => {
  const result = await pool.query(
    `
      SELECT id, booking_id, user_id, hotel_id, rating, comment, created_at, updated_at
      FROM booking.reviews
      WHERE id = $1
    `,
    [reviewId],
  );

  return result.rows[0] || null;
};

const createReview = async ({ bookingId, userId, hotelId, rating, comment }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const reviewResult = await client.query(
      `
        INSERT INTO booking.reviews (booking_id, user_id, hotel_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, booking_id, user_id, hotel_id, rating, comment, created_at, updated_at
      `,
      [bookingId, userId, hotelId, rating, comment],
    );

    await client.query(
      `
        UPDATE hotel.hotels
        SET
          rating = COALESCE((
            SELECT ROUND(AVG(r.rating)::numeric, 1)
            FROM booking.reviews r
            WHERE r.hotel_id = $1
          ), 0),
          reviews = (
            SELECT COUNT(*)
            FROM booking.reviews r
            WHERE r.hotel_id = $1
          )
        WHERE id = $1
      `,
      [hotelId],
    );

    await client.query('COMMIT');

    return reviewResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateReview = async ({ reviewId, rating, comment, hotelId }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const reviewResult = await client.query(
      `
        UPDATE booking.reviews
        SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, booking_id, user_id, hotel_id, rating, comment, created_at, updated_at
      `,
      [rating, comment, reviewId],
    );

    await client.query(
      `
        UPDATE hotel.hotels
        SET
          rating = COALESCE((
            SELECT ROUND(AVG(r.rating)::numeric, 1)
            FROM booking.reviews r
            WHERE r.hotel_id = $1
          ), 0),
          reviews = (
            SELECT COUNT(*)
            FROM booking.reviews r
            WHERE r.hotel_id = $1
          )
        WHERE id = $1
      `,
      [hotelId],
    );

    await client.query('COMMIT');

    return reviewResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteReview = async ({ reviewId, hotelId }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
        DELETE FROM booking.reviews
        WHERE id = $1
      `,
      [reviewId],
    );

    await client.query(
      `
        UPDATE hotel.hotels
        SET
          rating = COALESCE((
            SELECT ROUND(AVG(r.rating)::numeric, 1)
            FROM booking.reviews r
            WHERE r.hotel_id = $1
          ), 0),
          reviews = (
            SELECT COUNT(*)
            FROM booking.reviews r
            WHERE r.hotel_id = $1
          )
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

const getReviewsByHotelId = async ({ hotelId, page, limit }) => {
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const offset = (currentPage - 1) * currentLimit;

  const result = await pool.query(
    `
      SELECT r.id, r.booking_id, r.user_id, r.hotel_id, r.rating, r.comment, r.created_at, r.updated_at,
        COUNT(*) OVER() AS total
      FROM booking.reviews r
      JOIN auth.users u ON u.id = r.user_id
      WHERE r.hotel_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `,
    [hotelId, currentLimit, offset],
  );

  return {
    reviews: result.rows,
    total: result.rows[0]?.total || 0,
  };
};

const getReviewsByUserId = async (userId) => {
  const result = await pool.query(
    `
      SELECT r.id, r.booking_id, r.user_id, r.hotel_id, r.rating, r.comment, r.created_at, r.updated_at,
        h.name AS hotel_name
      FROM booking.reviews r
      JOIN hotel.hotels h ON h.id = r.hotel_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

module.exports = { getBookingForReview, getExistingReview, getReviewById, createReview, updateReview, deleteReview, getReviewsByHotelId, getReviewsByUserId };
