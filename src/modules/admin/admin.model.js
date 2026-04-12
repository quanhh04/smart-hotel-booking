const pool = require('../../config/db');

/** Thống kê tổng quan dashboard */
const getStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM booking.bookings) AS total_bookings,
      (SELECT COALESCE(SUM(amount), 0)::numeric FROM booking.payments WHERE status = 'SUCCESS') AS total_revenue,
      (SELECT COUNT(*)::int FROM hotel.hotels) AS total_hotels,
      (SELECT COUNT(*)::int FROM hotel.room_types) AS total_rooms,
      (SELECT COUNT(*)::int FROM auth.users) AS total_users
  `);
  return result.rows[0];
};

/** Doanh thu theo ngày trong khoảng thời gian */
const getRevenue = async (startDate, endDate) => {
  const result = await pool.query(
    `SELECT DATE(created_at) AS date, SUM(amount)::numeric AS revenue
     FROM booking.payments
     WHERE status = 'SUCCESS' AND created_at >= $1 AND created_at < ($2::date + INTERVAL '1 day')
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [startDate, endDate],
  );
  return result.rows;
};

/** Danh sách users, phân trang */
const getUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT id, email, role, display_name, phone, created_at, COUNT(*) OVER() AS total
     FROM auth.users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const total = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
  const users = result.rows.map(({ total: _, ...user }) => user);
  return { users, total };
};

/** Top khách sạn theo doanh thu hoặc số booking */
const getTopHotels = async (sortBy = 'revenue', limit = 10) => {
  const orderColumn = sortBy === 'booking_count' ? 'booking_count' : 'revenue';
  const result = await pool.query(
    `SELECT h.id, h.name, h.address,
            COUNT(b.id)::int AS booking_count,
            COALESCE(SUM(p.amount), 0)::numeric AS revenue
     FROM hotel.hotels h
     LEFT JOIN hotel.room_types rt ON rt.hotel_id = h.id
     LEFT JOIN booking.bookings b ON b.room_type_id = rt.id
     LEFT JOIN booking.payments p ON p.booking_id = b.id AND p.status = 'SUCCESS'
     GROUP BY h.id
     ORDER BY ${orderColumn} DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows;
};

module.exports = { getStats, getRevenue, getUsers, getTopHotels };
