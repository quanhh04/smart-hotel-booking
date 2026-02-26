const pool = require('../../config/db');

const processMockPayment = async ({ bookingId, amount }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const bookingResult = await client.query(
      `
        SELECT id, user_id, room_id, check_in, check_out, status, created_at
        FROM booking.bookings
        WHERE id = $1
        FOR UPDATE
      `,
      [bookingId],
    );

    const booking = bookingResult.rows[0];
    if (!booking) {
      const error = new Error('Booking not found');
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
        RETURNING id, user_id, room_id, check_in, check_out, status, created_at
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

module.exports = {
  processMockPayment,
};
