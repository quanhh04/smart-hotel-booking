const pool = require('../../config/db');
const { createError } = require('../../common/helpers/error');

const createBooking = async ({ userId, roomTypeId, checkIn, checkOut, paymentMethod }) => {
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

    const hotelResult = await client.query(
      `
        SELECT name
        FROM hotel.hotels
        WHERE id = $1
        FOR UPDATE
      `,
      [roomType.hotel_id],
    );
    // Đếm booking đang hoạt động trùng ngày
    const countResult = await client.query(
      `
        SELECT COUNT(*)::int AS booked_count
        FROM booking.bookings
        WHERE room_type_id = $1
          AND status IN ('PENDING', 'CONFIRMED', 'PAID')
          AND NOT (check_out <= $2 OR check_in >= $3)
      `,
      [roomTypeId, checkIn, checkOut],
    );

    const bookedCount = countResult.rows[0].booked_count;
    if (roomType.total_quantity - bookedCount <= 0) {
      throw createError('Loại phòng đã hết phòng trống cho khoảng ngày này', 409);
    }

    // pay_at_hotel → CONFIRMED ngay, online → PENDING chờ thanh toán
    const status = paymentMethod === 'pay_at_hotel' ? 'CONFIRMED' : 'PENDING';
    const bookingResult = await client.query(
      `
        INSERT INTO booking.bookings (room_type_id, user_id, check_in, check_out, status, payment_method)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, room_type_id, user_id, check_in, check_out, status, payment_method, created_at
      `,
      [roomTypeId, userId, checkIn, checkOut, status, paymentMethod],
    );

    await client.query('COMMIT');

    // Tính tổng tiền để client biết
    const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / (24 * 60 * 60 * 1000));
    const totalAmount = Number(roomType.price_per_night) * nights;
    return {
      ...bookingResult.rows[0],
      total_amount: totalAmount,
      nights,
      room_type: roomType,
      hotel_name: hotelResult.rows[0].name
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
        b.id, b.room_type_id, b.user_id, b.check_in, b.check_out,
        b.status, b.payment_method, b.created_at,
        r.name AS room_name, r.price_per_night,
        h.id AS hotel_id, h.name AS hotel_name, h.address AS hotel_address,
        (r.price_per_night * (b.check_out - b.check_in))::numeric AS total_price
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
  const checkResult = await pool.query(
    `
      SELECT id, status, payment_method
      FROM booking.bookings
      WHERE id = $1 AND user_id = $2
    `,
    [bookingId, userId],
  );

  const booking = checkResult.rows[0];
  if (!booking) {
    return null;
  }

  // Cho phép hủy booking PENDING (online chưa thanh toán) hoặc CONFIRMED (pay_at_hotel)
  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    throw createError('Chỉ có thể hủy đặt phòng chưa thanh toán');
  }
  const result = await pool.query(
    `
      UPDATE booking.bookings
      SET status = 'CANCELLED'
      WHERE id = $1 AND user_id = $2 AND status IN ('PENDING', 'CONFIRMED')
      RETURNING id, room_type_id, user_id, check_in, check_out, status, payment_method, created_at
    `,
    [bookingId, userId],
  );
  return result.rows[0];
};

const getBookingById = async (bookingId) => {
  const result = await pool.query(
    `
      SELECT
        b.id, b.room_type_id, b.user_id, b.check_in, b.check_out,
        b.status, b.payment_method, b.reminder_sent, b.created_at,
        r.name AS room_name, r.price_per_night, r.max_guests, r.description AS room_description,
        h.id AS hotel_id, h.name AS hotel_name, h.address AS hotel_address,
        p.id AS payment_id, p.amount AS payment_amount, p.status AS payment_status, p.created_at AS payment_date
      FROM booking.bookings b
      LEFT JOIN hotel.room_types r ON r.id = b.room_type_id
      LEFT JOIN hotel.hotels h ON h.id = r.hotel_id
      LEFT JOIN booking.payments p ON p.booking_id = b.id
      WHERE b.id = $1
    `,
    [bookingId],
  );
  return result.rows[0] || null;
};

const getAllBookings = async ({ status, page = 1, limit = 10 }) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`b.status = $${paramIndex++}`);
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit);
  const limitParam = paramIndex++;
  params.push((page - 1) * limit);
  const offsetParam = paramIndex++;

  const result = await pool.query(
    `
      SELECT
        b.id, b.room_type_id, b.user_id, b.check_in, b.check_out,
        b.status, b.payment_method, b.created_at,
        r.name AS room_name, r.price_per_night,
        h.name AS hotel_name, h.address AS hotel_address,
        u.email AS user_email, u.display_name AS user_name,
        p.id AS payment_id, p.amount AS payment_amount, p.status AS payment_status,
        COUNT(*) OVER() AS total
      FROM booking.bookings b
      LEFT JOIN hotel.room_types r ON r.id = b.room_type_id
      LEFT JOIN hotel.hotels h ON h.id = r.hotel_id
      LEFT JOIN auth.users u ON u.id = b.user_id
      LEFT JOIN booking.payments p ON p.booking_id = b.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `,
    params,
  );

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
  const bookings = result.rows.map(({ total: _, ...row }) => row);
  return { bookings, total };
};

module.exports = { createBooking, getBookingsByUserId, cancelBooking, getBookingById, getAllBookings };