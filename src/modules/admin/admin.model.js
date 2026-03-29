const pool = require('../../config/db');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('admin.model');

/**
 * Thống kê tổng quan: tổng booking, doanh thu, số khách sạn, phòng, người dùng.
 */
const getStats = async () => {
  log.info('getStats: querying dashboard stats');
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM booking.bookings) AS total_bookings,
      (SELECT COALESCE(SUM(amount), 0)::numeric FROM booking.payments WHERE status = 'SUCCESS') AS total_revenue,
      (SELECT COUNT(*)::int FROM hotel.hotels) AS total_hotels,
      (SELECT COUNT(*)::int FROM hotel.room_types) AS total_rooms,
      (SELECT COUNT(*)::int FROM auth.users) AS total_users
  `);
  log.info('getStats: done');
  return result.rows[0];
};

/**
 * Thống kê doanh thu theo khoảng thời gian, group by ngày.
 */
const getRevenue = async (startDate, endDate) => {
  log.info('getRevenue: querying', { startDate, endDate });
  const result = await pool.query(
    `
      SELECT
        DATE(created_at) AS date,
        SUM(amount)::numeric AS revenue
      FROM booking.payments
      WHERE status = 'SUCCESS'
        AND created_at >= $1
        AND created_at < ($2::date + INTERVAL '1 day')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    [startDate, endDate],
  );
  log.info('getRevenue: done', { dataPoints: result.rows.length });
  return result.rows;
};

/**
 * Danh sách người dùng (không bao gồm password), phân trang.
 */
const getUsers = async (page = 1, limit = 10) => {
  log.info('getUsers: querying', { page, limit });
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `
      SELECT
        id, email, role, display_name, phone, created_at,
        COUNT(*) OVER() AS total
      FROM auth.users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  );

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
  const users = result.rows.map(({ total: _, ...user }) => user);
  log.info('getUsers: done', { total });
  return { users, total };
};

/**
 * Top khách sạn theo doanh thu hoặc số booking.
 */
const getTopHotels = async (sortBy = 'revenue', limit = 10) => {
  log.info('getTopHotels: querying', { sortBy, limit });
  const orderColumn = sortBy === 'booking_count'
    ? 'booking_count'
    : 'revenue';

  const result = await pool.query(
    `
      SELECT
        h.id,
        h.name,
        h.address,
        COUNT(b.id)::int AS booking_count,
        COALESCE(SUM(p.amount), 0)::numeric AS revenue
      FROM hotel.hotels h
      LEFT JOIN hotel.room_types rt ON rt.hotel_id = h.id
      LEFT JOIN booking.bookings b ON b.room_type_id = rt.id
      LEFT JOIN booking.payments p ON p.booking_id = b.id AND p.status = 'SUCCESS'
      GROUP BY h.id
      ORDER BY ${orderColumn} DESC
      LIMIT $1
    `,
    [limit],
  );
  log.info('getTopHotels: done', { count: result.rows.length });
  return result.rows;
};

module.exports = { getStats, getRevenue, getUsers, getTopHotels };