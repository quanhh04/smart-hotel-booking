const pool = require('../../config/db');
const { createError } = require('../../common/helpers/error');

const createNotification = async ({ userId, type, title, message, metadata = {} }) => {
  const result = await pool.query(
    `
      INSERT INTO notification.notifications (user_id, type, title, message, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, type, title, message, metadata, is_read, created_at
    `,
    [userId, type, title, message, JSON.stringify(metadata)],
  );

  return result.rows[0];
};

const createBulkNotifications = async (notifications) => {
  if (!notifications.length) return [];

  const values = [];
  const params = [];
  let paramIndex = 1;

  for (const n of notifications) {
    values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`);
    params.push(n.userId, n.type, n.title, n.message, JSON.stringify(n.metadata || {}));
    paramIndex += 5;
  }

  const result = await pool.query(
    `
      INSERT INTO notification.notifications (user_id, type, title, message, metadata)
      VALUES ${values.join(', ')}
      RETURNING id, user_id, type, title, message, metadata, is_read, created_at
    `,
    params,
  );

  return result.rows;
};

const getByUserId = async (userId, page, limit) => {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
      SELECT id, user_id, type, title, message, metadata, is_read, created_at,
        COUNT(*) OVER() AS total
      FROM notification.notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset],
  );

  return {
    notifications: result.rows,
    total: parseInt(result.rows[0]?.total || 0, 10),
  };
};

const getUnreadCount = async (userId) => {
  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS unread_count
      FROM notification.notifications
      WHERE user_id = $1 AND is_read = FALSE
    `,
    [userId],
  );

  return result.rows[0].unread_count;
};

const getById = async (notificationId) => {
  const result = await pool.query(
    `
      SELECT id, user_id, type, title, message, metadata, is_read, created_at
      FROM notification.notifications
      WHERE id = $1
    `,
    [notificationId],
  );

  return result.rows[0] || null;
};

const markAsRead = async (notificationId) => {
  const result = await pool.query(
    `
      UPDATE notification.notifications
      SET is_read = TRUE
      WHERE id = $1
      RETURNING id, user_id, type, title, message, metadata, is_read, created_at
    `,
    [notificationId],
  );

  return result.rows[0] || null;
};

const markAllAsRead = async (userId) => {
  const result = await pool.query(
    `
      UPDATE notification.notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE
    `,
    [userId],
  );

  return result.rowCount;
};

const deleteById = async (notificationId) => {
  const result = await pool.query(
    `
      DELETE FROM notification.notifications
      WHERE id = $1
    `,
    [notificationId],
  );

  return result.rowCount;
};

module.exports = {
  createNotification,
  createBulkNotifications,
  getByUserId,
  getUnreadCount,
  getById,
  markAsRead,
  markAllAsRead,
  deleteById,
};
