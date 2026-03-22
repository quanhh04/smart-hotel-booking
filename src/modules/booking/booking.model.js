const pool = require('../../config/db');
const { createError } = require('../../common/helpers/error');

const createBooking = async ({ userId, roomTypeId, checkIn, checkOut }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const roomTypeResult = await client.query(
      `
        SELECT id, hotel_id, name, price_per_night, max_guests, description, total_quantity, created_at
        FROM hotel.room_types
        WHERE id = $1
        FOR UPDATE
      `,
      [roomTypeId],
    );

    const roomType = roomTypeResult.rows[0];
    if (!roomType) {
      throw createError('Loại phòng không tồn tại', 404);
    }

    // Count active bookings overlapping the requested dates
    const countResult = await client.query(
      `
        SELECT COUNT(*)::int AS booked_count
        FROM booking.bookings
        WHERE room_type_id = $1
          AND status IN ('PENDING', 'PAID')
          AND NOT (check_out <= $2 OR check_in >= $3)
      `,
      [roomTypeId, checkIn, checkOut],
    );

    const bookedCount = countResult.rows[0].booked_count;
    const availableQuantity = roomType.total_quantity - bookedCount;

    if (availableQuantity <= 0) {
      throw createError('Loại phòng đã hết phòng trống cho khoảng ngày này', 409);
    }

    const bookingResult = await client.query(
      `
        INSERT INTO booking.bookings (room_type_id, user_id, check_in, check_out, status)
        VALUES ($1, $2, $3, $4, 'PENDING')
        RETURNING id, room_type_id, user_id, check_in, check_out, status, created_at
      `,
      [roomTypeId, userId, checkIn, checkOut],
    );

    await client.query('COMMIT');

    return {
      ...bookingResult.rows[0],
      room_type: roomType,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getBookingsByUserId = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        b.id, b.room_type_id, b.user_id, b.check_in, b.check_out, b.status, b.created_at,
        r.name AS room_name, r.price_per_night, h.name AS hotel_name
      FROM booking.bookings b
      LEFT JOIN hotel.room_types r ON r.id = b.room_type_id
      LEFT JOIN hotel.hotels h ON h.id = r.hotel_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

const cancelBooking = async ({ bookingId, userId }) => {
  // First check if booking exists and get its current status
  const checkResult = await pool.query(
    `
      SELECT id, status
      FROM booking.bookings
      WHERE id = $1 AND user_id = $2
    `,
    [bookingId, userId],
  );

  const booking = checkResult.rows[0];
  if (!booking) {
    return null;
  }

  if (booking.status !== 'PENDING') {
    throw createError('Chỉ có thể hủy booking ở trạng thái PENDING');
  }

  const result = await pool.query(
    `
      UPDATE booking.bookings
      SET status = 'CANCELLED'
      WHERE id = $1 AND user_id = $2 AND status = 'PENDING'
      RETURNING id, room_type_id, user_id, check_in, check_out, status, created_at
    `,
    [bookingId, userId],
  );

  return result.rows[0];
};

module.exports = {
  createBooking,
  getBookingsByUserId,
  cancelBooking,
};
