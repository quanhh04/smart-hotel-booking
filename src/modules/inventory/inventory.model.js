const pool = require('../../config/db');
const { createError } = require('../../common/helpers/error');

const updateTotalQuantity = async ({ roomTypeId, totalQuantity }) => {
  if (totalQuantity < 0) {
    throw createError('total_quantity không được âm');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock the room_type row and check existence
    const roomResult = await client.query(
      'SELECT id, total_quantity FROM hotel.room_types WHERE id = $1 FOR UPDATE',
      [roomTypeId],
    );

    if (roomResult.rows.length === 0) {
      throw createError('Loại phòng không tồn tại', 404);
    }

    // Count active bookings for future dates
    const bookingResult = await client.query(
      `SELECT COUNT(*) AS active_count
       FROM booking.bookings
       WHERE room_type_id = $1
         AND status IN ('PENDING', 'PAID')
         AND check_out > NOW()`,
      [roomTypeId],
    );

    const activeCount = parseInt(bookingResult.rows[0].active_count, 10);

    if (totalQuantity < activeCount) {
      throw createError('Không thể giảm tồn kho dưới số booking đang hoạt động', 409);
    }

    const updateResult = await client.query(
      `UPDATE hotel.room_types
       SET total_quantity = $1
       WHERE id = $2
       RETURNING id, hotel_id, name, price_per_night, max_guests, description, total_quantity, created_at`,
      [totalQuantity, roomTypeId],
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getInventoryByHotelId = async ({ hotelId, checkIn, checkOut }) => {
  let dateFilterCheckIn;
  let dateFilterCheckOut;

  if (checkIn && checkOut) {
    dateFilterCheckIn = checkIn;
    dateFilterCheckOut = checkOut;
  } else {
    // Default to current date
    const today = new Date().toISOString().split('T')[0];
    dateFilterCheckIn = today;
    dateFilterCheckOut = today;
  }

  const result = await pool.query(
    `SELECT
       rt.id,
       rt.name,
       rt.price_per_night,
       rt.max_guests,
       rt.description,
       rt.total_quantity,
       COUNT(b.id)::int AS booked_quantity,
       (rt.total_quantity - COUNT(b.id))::int AS available_quantity
     FROM hotel.room_types rt
     LEFT JOIN booking.bookings b
       ON b.room_type_id = rt.id
       AND b.status IN ('PENDING', 'PAID')
       AND NOT (b.check_out <= $2 OR b.check_in >= $3)
     WHERE rt.hotel_id = $1
     GROUP BY rt.id
     ORDER BY rt.id`,
    [hotelId, dateFilterCheckIn, dateFilterCheckOut],
  );

  return result.rows;
};

module.exports = {
  updateTotalQuantity,
  getInventoryByHotelId,
};
