const pool = require('../../config/db');

const processMockPayment = async ({ bookingId, amount }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const bookingResult = await client.query(
      `
        SELECT id, user_id, room_type_id, check_in, check_out, status, created_at
        FROM booking.bookings
        WHERE id = $1
        FOR UPDATE
      `,
      [bookingId],
    );

    const booking = bookingResult.rows[0];
    if (!booking) {
      const error = new Error('Không tìm thấy đặt phòng');
      error.status = 404;
      throw error;
    }

    const paymentResult = await client.query(
      `
        INSERT INTO booking.payments (booking_id, amount, status)
        VALUES ($1, $2, 'SUCCESS')
        RETURNING id, booking_id, amount, status, created_at
      `,
      [bookingId, amount],
    );

    const updatedBookingResult = await client.query(
      `
        UPDATE booking.bookings
        SET status = 'PAID'
        WHERE id = $1
        RETURNING id, user_id, room_type_id, check_in, check_out, status, created_at
      `,
      [bookingId],
    );

    await client.query('COMMIT');

    return {
      payment: paymentResult.rows[0],
      booking: updatedBookingResult.rows[0],
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getPaymentsByUserId = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        p.id, p.booking_id, p.amount, p.status, p.created_at,
        b.room_type_id, b.check_in, b.check_out,
        r.name AS room_name, h.name AS hotel_name
      FROM booking.payments p
      JOIN booking.bookings b ON b.id = p.booking_id
      LEFT JOIN hotel.room_types r ON r.id = b.room_type_id
      LEFT JOIN hotel.hotels h ON h.id = r.hotel_id
      WHERE b.user_id = $1
      ORDER BY p.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

module.exports = {
  processMockPayment,
  getPaymentsByUserId,
};
