const pool = require('../../config/db');
const { createError } = require('../../common/helpers/error');

/**
 * Tính số đêm giữa 2 ngày.
 */
const calculateNights = (checkIn, checkOut) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(checkOut) - new Date(checkIn)) / msPerDay);
};

/**
 * Xử lý thanh toán online cho booking.
 * Server tự tính amount = price_per_night × số đêm.
 * Chỉ cho phép thanh toán booking online + status PENDING.
 */
const processPayment = async ({ bookingId, userId }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lấy booking + giá phòng, lock row tránh race condition
    const bookingResult = await client.query(
      `
        SELECT
          b.id, b.user_id, b.room_type_id, b.check_in, b.check_out,
          b.status, b.payment_method,
          r.price_per_night, r.name AS room_name
        FROM booking.bookings b
        JOIN hotel.room_types r ON r.id = b.room_type_id
        WHERE b.id = $1
        FOR UPDATE OF b
      `,
      [bookingId],
    );

    const booking = bookingResult.rows[0];
    if (!booking) {
      throw createError('Không tìm thấy đặt phòng', 404);
    }

    // Chỉ chủ booking mới được thanh toán
    if (booking.user_id !== userId) {
      throw createError('Bạn không có quyền thanh toán đặt phòng này', 403);
    }

    if (booking.payment_method !== 'online') {
      throw createError('Đặt phòng này thanh toán tại khách sạn, không cần thanh toán online');
    }

    if (booking.status !== 'PENDING') {
      throw createError('Chỉ có thể thanh toán đặt phòng đang chờ xử lý');
    }

    // Server tự tính amount
    const nights = calculateNights(booking.check_in, booking.check_out);
    const amount = Number(booking.price_per_night) * nights;

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
        RETURNING id, user_id, room_type_id, check_in, check_out, status, payment_method, created_at
      `,
      [bookingId],
    );

    await client.query('COMMIT');

    return {
      payment: paymentResult.rows[0],
      booking: updatedBookingResult.rows[0],
      calculation: { price_per_night: booking.price_per_night, nights, total: amount },
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
        b.room_type_id, b.check_in, b.check_out, b.payment_method,
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

module.exports = { processPayment, getPaymentsByUserId };
