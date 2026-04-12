const pool = require('../../config/db');

const createNotification = async ({ userId, type, title, message, metadata = {} }) => {
  const result = await pool.query(
    `INSERT INTO notification.notifications (user_id, type, title, message, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, type, title, message, metadata, is_read, created_at`,
    [userId, type, title, message, JSON.stringify(metadata)],
  );
  return result.rows[0];
};

const createBulkNotifications = async (notifications) => {
  if (!notifications.length) return [];

  const values = [];
  const params = [];
  let idx = 1;

  for (const n of notifications) {
    values.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
    params.push(n.userId, n.type, n.title, n.message, JSON.stringify(n.metadata || {}));
    idx += 5;
  }

  const result = await pool.query(
    `INSERT INTO notification.notifications (user_id, type, title, message, metadata)
     VALUES ${values.join(', ')}
     RETURNING id, user_id, type, title, message, metadata, is_read, created_at`,
    params,
  );
  return result.rows;
};

const getByUserId = async (userId, page, limit) => {
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const offset = (currentPage - 1) * currentLimit;

  const result = await pool.query(
    `SELECT id, user_id, type, title, message, metadata, is_read, created_at,
            COUNT(*) OVER() AS total
     FROM notification.notifications WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, currentLimit, offset],
  );
  return {
    notifications: result.rows,
    total: parseInt(result.rows[0]?.total || 0, 10),
  };
};

const getUnreadCount = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS unread_count FROM notification.notifications
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId],
  );
  return result.rows[0].unread_count;
};

const getById = async (notificationId) => {
  const result = await pool.query(
    `SELECT id, user_id, type, title, message, metadata, is_read, created_at
     FROM notification.notifications WHERE id = $1`,
    [notificationId],
  );
  return result.rows[0] || null;
};

const markAsRead = async (notificationId) => {
  const result = await pool.query(
    `UPDATE notification.notifications SET is_read = TRUE WHERE id = $1
     RETURNING id, user_id, type, title, message, metadata, is_read, created_at`,
    [notificationId],
  );
  return result.rows[0] || null;
};

const markAllAsRead = async (userId) => {
  const result = await pool.query(
    `UPDATE notification.notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
    [userId],
  );
  return result.rowCount;
};

const deleteById = async (notificationId) => {
  await pool.query('DELETE FROM notification.notifications WHERE id = $1', [notificationId]);
};

const getBookingsForReminder = async () => {
  const result = await pool.query(
    `SELECT b.id AS booking_id, b.user_id, b.check_in, b.check_out, b.status,
            u.email, r.name AS room_name, h.name AS hotel_name
     FROM booking.bookings b
     JOIN auth.users u ON u.id = b.user_id
     JOIN hotel.room_types r ON r.id = b.room_type_id
     JOIN hotel.hotels h ON h.id = r.hotel_id
     WHERE b.check_in = CURRENT_DATE + INTERVAL '1 day'
       AND b.status IN ('PAID', 'CONFIRMED')
       AND b.reminder_sent = FALSE`,
  );
  return result.rows;
};

const markReminderSent = async (bookingId) => {
  await pool.query('UPDATE booking.bookings SET reminder_sent = TRUE WHERE id = $1', [bookingId]);
};

module.exports = {
  createNotification, createBulkNotifications, getByUserId, getUnreadCount,
  getById, markAsRead, markAllAsRead, deleteById, getBookingsForReminder, markReminderSent,
};
