const pool = require('../../config/db');

const trackRoomClick = async ({ roomId, userId }) => {
  const query = `
    INSERT INTO ai.room_clicks (room_id, user_id)
    VALUES ($1, $2)
    RETURNING id, room_id, user_id, clicked_at
  `;

  const { rows } = await pool.query(query, [roomId, userId || null]);
  return rows[0];
};

const getTopIntents = async () => {
  const query = `
    SELECT intent, COUNT(*)::int AS count
    FROM ai.intent_logs
    GROUP BY intent
    ORDER BY count DESC, intent ASC
    LIMIT 10
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const getTopAmenitiesAsked = async () => {
  const query = `
    SELECT amenity, COUNT(*)::int AS count
    FROM ai.amenity_queries
    GROUP BY amenity
    ORDER BY count DESC, amenity ASC
    LIMIT 10
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const getTopRoomsClicked = async () => {
  const query = `
    SELECT
      rc.room_id,
      r.name AS room_name,
      COUNT(*)::int AS count
    FROM ai.room_clicks rc
    LEFT JOIN hotel.rooms r ON r.id = rc.room_id
    GROUP BY rc.room_id, r.name
    ORDER BY count DESC, rc.room_id ASC
    LIMIT 10
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const getStats = async () => {
  const [topIntents, topAmenitiesAsked, topRoomsClicked] = await Promise.all([
    getTopIntents(),
    getTopAmenitiesAsked(),
    getTopRoomsClicked(),
  ]);

  return {
    topIntents,
    topAmenitiesAsked,
    topRoomsClicked,
  };
};

module.exports = {
  trackRoomClick,
  getStats,
};
