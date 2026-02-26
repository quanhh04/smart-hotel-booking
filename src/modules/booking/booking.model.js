const pool = require('../../config/db');

const getRoomById = async (roomId) => {
  const result = await pool.query(
    `
      SELECT id, hotel_id, name, price_per_night, max_guests, description, created_at
      FROM hotel.rooms
      WHERE id = $1
    `,
    [roomId],
  );

  return result.rows[0];
};

const isRoomUnavailable = async ({ roomId, checkIn, checkOut }) => {
  const result = await pool.query(
    `
      SELECT 1
      FROM booking.bookings
      WHERE room_id = $1
        AND NOT (check_out <= $2 OR check_in >= $3)
      LIMIT 1
    `,
    [roomId, checkIn, checkOut],
  );

  return result.rowCount > 0;
};

const createBooking = async ({ userId, roomId, checkIn, checkOut }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
console.log('Checking room availability for room_id:', roomId, 'check_in:', checkIn, 'check_out:', checkOut);

    const roomResult = await client.query(
      `
        SELECT id, hotel_id, name, price_per_night, max_guests, description, created_at
        FROM hotel.rooms
        WHERE id = $1
        FOR SHARE
      `,
      [roomId],
    );
console.log('Room query result:', roomResult.rows);
    const room = roomResult.rows[0];
    if (!room) {
      const error = new Error('Room not found');
      error.status = 404;
      throw error;
    }
console.log('Checking availability for room_id:', roomId);
    const availabilityResult = await client.query(
      `
        SELECT 1
        FROM booking.bookings
        WHERE room_id = $1
          AND NOT (check_out <= $2 OR check_in >= $3)
        LIMIT 1
      `,
      [roomId, checkIn, checkOut],
    );
console.log('Availability query result:', availabilityResult.rows);
    if (availabilityResult.rowCount > 0) {
      const error = new Error('Room is not available for the selected dates');
      error.status = 409;
      throw error;
    }
console.log('Creating booking for room_id:', roomId, 'user_id:', userId);
    const bookingResult = await client.query(
      `
        INSERT INTO booking.bookings (room_id, user_id, check_in, check_out, status)
        VALUES ($1, $2, $3, $4, 'PENDING')
        RETURNING id, room_id, user_id, check_in, check_out, status, created_at
      `,
      [roomId, userId, checkIn, checkOut],
    );

    await client.query('COMMIT');

    return {
      ...bookingResult.rows[0],
      room,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getRoomById,
  isRoomUnavailable,
  createBooking,
};
