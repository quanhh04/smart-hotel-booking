const pool = require('../../config/db.js');

/**
 * Tìm phòng theo các bộ lọc slot đã gộp.
 * Xây dựng SQL tham số hóa với placeholder $N.
 * JOIN room_types → hotels → room_amenities → amenities.
 * @param {object} filters - { min_price, max_price, guests, amenities, check_in, check_out, city }
 * @returns {Promise<Array>} Danh sách phòng phù hợp (tối đa 10)
 */
async function searchRooms(filters) {
  const { min_price, max_price, guests, amenities, check_in, check_out, city } = filters || {};

  const conditions = [];
  const values = [];
  let paramIdx = 0;

  // Price filters
  if (min_price != null) {
    values.push(min_price);
    paramIdx++;
    conditions.push(`r.price_per_night >= $${paramIdx}`);
  }
  if (max_price != null) {
    values.push(max_price);
    paramIdx++;
    conditions.push(`r.price_per_night <= $${paramIdx}`);
  }

  // Guest filter
  if (guests != null) {
    values.push(guests);
    paramIdx++;
    conditions.push(`r.max_guests >= $${paramIdx}`);
  }

  // City filter (case-insensitive partial match on hotel address)
  if (city) {
    values.push(`%${city.toLowerCase()}%`);
    paramIdx++;
    conditions.push(`LOWER(h.address) LIKE $${paramIdx}`);
  }

  // Amenity filter — require ALL requested amenities
  let amenityJoin = '';
  let amenityHaving = '';
  if (amenities && amenities.length > 0) {
    values.push(amenities);
    paramIdx++;
    amenityJoin = `JOIN hotel.room_amenities ra2 ON ra2.room_type_id = r.id
      JOIN hotel.amenities a2 ON a2.id = ra2.amenity_id AND LOWER(a2.name) = ANY($${paramIdx})`;
    values.push(amenities.length);
    paramIdx++;
    amenityHaving = `HAVING COUNT(DISTINCT LOWER(a2.name)) = $${paramIdx}`;
  }

  // Date availability filter
  let bookingJoin = '';
  let availabilitySelect = ', r.total_quantity AS availability';
  let availabilityHaving = '';
  if (check_in && check_out) {
    values.push(check_in);
    const checkInIdx = ++paramIdx;
    values.push(check_out);
    const checkOutIdx = ++paramIdx;
    bookingJoin = `LEFT JOIN booking.bookings b
      ON b.room_type_id = r.id
      AND b.status IN ('PENDING', 'CONFIRMED', 'PAID')
      AND NOT (b.check_out <= $${checkInIdx} OR b.check_in >= $${checkOutIdx})`;
    availabilitySelect = ', r.total_quantity - COUNT(DISTINCT b.id) AS availability';
    availabilityHaving = 'r.total_quantity - COUNT(DISTINCT b.id) > 0';
  }

  // Build HAVING clause
  const havingParts = [];
  if (amenityHaving) havingParts.push(amenityHaving.replace('HAVING ', ''));
  if (availabilityHaving) havingParts.push(availabilityHaving);
  const havingClause = havingParts.length > 0 ? `HAVING ${havingParts.join(' AND ')}` : '';

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Relevance score: more matching filters → higher score
  const scoreParts = [];
  if (max_price != null) scoreParts.push('CASE WHEN r.price_per_night <= ' + max_price + ' THEN 1 ELSE 0 END');
  if (guests != null) scoreParts.push('CASE WHEN r.max_guests >= ' + guests + ' THEN 1 ELSE 0 END');
  if (city) scoreParts.push('1'); // already filtered
  const scoreExpr = scoreParts.length > 0 ? scoreParts.join(' + ') : '0';

  const query = `
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      h.name AS hotel_name,
      h.address AS hotel_address,
      r.price_per_night,
      r.max_guests,
      COALESCE(
        ARRAY_AGG(DISTINCT a_all.name) FILTER (WHERE a_all.name IS NOT NULL),
        '{}'
      ) AS amenities
      ${availabilitySelect}
    FROM hotel.room_types r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra_all ON ra_all.room_type_id = r.id
    LEFT JOIN hotel.amenities a_all ON a_all.id = ra_all.amenity_id
    ${amenityJoin}
    ${bookingJoin}
    ${whereClause}
    GROUP BY r.id, r.name, r.price_per_night, r.max_guests, r.total_quantity,
             h.name, h.address
    ${havingClause}
    ORDER BY (${scoreExpr}) DESC, r.price_per_night ASC
    LIMIT 10
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

/**
 * Lấy danh sách phòng ứng viên cho recommendation engine.
 * JOIN hotels, amenities. Lọc theo guests, max_price nếu có.
 * @param {object} filters - { guests, max_price, amenities, limit }
 * @returns {Promise<Array>} Danh sách phòng ứng viên
 */
async function getCandidateRooms(filters) {
  const { guests, max_price } = filters || {};
  const conditions = [];
  const values = [];
  let paramIdx = 0;

  if (guests != null) {
    values.push(Number(guests));
    paramIdx++;
    conditions.push(`r.max_guests >= $${paramIdx}`);
  }
  if (max_price != null) {
    values.push(Number(max_price));
    paramIdx++;
    conditions.push(`r.price_per_night <= $${paramIdx} * 1.5`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      r.hotel_id,
      h.name AS hotel_name,
      h.address AS hotel_address,
      r.price_per_night,
      r.max_guests,
      COALESCE(h.rating, 0) AS hotel_rating,
      COALESCE(
        ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL),
        '{}'
      ) AS amenities
    FROM hotel.room_types r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    ${whereClause}
    GROUP BY r.id, r.name, r.hotel_id, h.name, h.address, r.price_per_night, r.max_guests, h.rating
    ORDER BY r.price_per_night ASC
    LIMIT 100
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

/**
 * Đếm số booking (CONFIRMED/PAID) theo room_type để tính popularity.
 * @returns {Promise<Map>} Map<roomTypeId, bookingCount>
 */
async function getBookingCounts() {
  const result = await pool.query(`
    SELECT room_type_id, COUNT(*)::int AS booking_count
    FROM booking.bookings
    WHERE status IN ('CONFIRMED', 'PAID')
    GROUP BY room_type_id
  `);
  const map = new Map();
  for (const row of result.rows) {
    map.set(row.room_type_id, row.booking_count);
  }
  return map;
}

/**
 * Lấy lịch sử booking của user để phân tích profile.
 * @param {number} userId - ID người dùng
 * @returns {Promise<Array>} Danh sách booking trước đó
 */
async function getUserBookingHistory(userId) {
  const result = await pool.query(`
    SELECT
      b.id, b.room_type_id, b.check_in, b.check_out, b.status, b.created_at,
      r.name AS room_name, r.price_per_night, r.max_guests,
      h.id AS hotel_id, h.name AS hotel_name, h.address AS hotel_address
    FROM booking.bookings b
    JOIN hotel.room_types r ON r.id = b.room_type_id
    JOIN hotel.hotels h ON h.id = r.hotel_id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
  `, [userId]);
  return result.rows;
}

/**
 * Tìm phòng tương tự dựa trên profile lịch sử booking.
 * Giá ±30% avg_price, cùng khoảng max_guests, ưu tiên cùng thành phố.
 * @param {object} profile - { avgPrice, maxGuests, cities, excludeRoomIds }
 * @returns {Promise<Array>} Danh sách phòng tương tự
 */
async function findSimilarRooms(profile) {
  const { avgPrice, maxGuests, cities, excludeRoomIds } = profile;
  const minPrice = Math.round(avgPrice * 0.7);
  const maxPrice = Math.round(avgPrice * 1.3);

  const values = [minPrice, maxPrice, maxGuests || 1];
  let paramIdx = 3;

  let excludeClause = '';
  if (excludeRoomIds && excludeRoomIds.length > 0) {
    values.push(excludeRoomIds);
    paramIdx++;
    excludeClause = `AND r.id != ALL($${paramIdx})`;
  }

  // City priority: rooms in frequent cities get a bonus
  let cityOrderClause = '0';
  if (cities && cities.length > 0) {
    values.push(cities.map(c => `%${c.toLowerCase()}%`));
    paramIdx++;
    cityOrderClause = `CASE WHEN LOWER(h.address) LIKE ANY($${paramIdx}) THEN 1 ELSE 0 END`;
  }

  const query = `
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      r.hotel_id,
      h.name AS hotel_name,
      h.address AS hotel_address,
      r.price_per_night,
      r.max_guests,
      COALESCE(
        ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL),
        '{}'
      ) AS amenities,
      ${cityOrderClause} AS city_match
    FROM hotel.room_types r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    WHERE r.price_per_night BETWEEN $1 AND $2
      AND r.max_guests >= $3
      ${excludeClause}
    GROUP BY r.id, r.name, r.hotel_id, h.name, h.address, r.price_per_night, r.max_guests
    ORDER BY ${cityOrderClause} DESC, ABS(r.price_per_night - ${Math.round(avgPrice)}) ASC
    LIMIT 10
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

/**
 * Lấy danh sách phòng trending theo số booking CONFIRMED/PAID trong N ngày gần đây.
 * @param {number} days - Số ngày tính trending (7-30)
 * @returns {Promise<Array>} Danh sách phòng trending kèm booking_count
 */
async function getTrendingRooms(days) {
  const result = await pool.query(`
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      r.hotel_id,
      h.name AS hotel_name,
      h.address AS hotel_address,
      r.price_per_night,
      r.max_guests,
      COALESCE(
        ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL),
        '{}'
      ) AS amenities,
      COUNT(DISTINCT b.id)::int AS booking_count
    FROM booking.bookings b
    JOIN hotel.room_types r ON r.id = b.room_type_id
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    WHERE b.status IN ('CONFIRMED', 'PAID')
      AND b.created_at >= NOW() - ($1 || ' days')::interval
    GROUP BY r.id, r.name, r.hotel_id, h.name, h.address, r.price_per_night, r.max_guests
    ORDER BY booking_count DESC
    LIMIT 20
  `, [days]);
  return result.rows;
}

/**
 * Đếm booking kỳ trước để tính phần trăm thay đổi trending.
 * Kỳ trước = khoảng [2*days ago, days ago].
 * @param {number} days - Số ngày của kỳ hiện tại
 * @returns {Promise<Map>} Map<roomTypeId, bookingCount>
 */
async function getPreviousPeriodCounts(days) {
  const result = await pool.query(`
    SELECT room_type_id, COUNT(*)::int AS booking_count
    FROM booking.bookings
    WHERE status IN ('CONFIRMED', 'PAID')
      AND created_at >= NOW() - ($1 || ' days')::interval
      AND created_at < NOW() - ($2 || ' days')::interval
    GROUP BY room_type_id
  `, [days * 2, days]);
  const map = new Map();
  for (const row of result.rows) {
    map.set(row.room_type_id, row.booking_count);
  }
  return map;
}

/**
 * Ghi log intent chatbot vào bảng ai.intent_logs.
 * @param {object} data - { intent, message, slots, sessionId, userId }
 * @returns {Promise<object>} Row đã insert
 */
async function insertIntentLog(data) {
  const { intent, message, slots, sessionId, userId } = data;
  const result = await pool.query(
    `INSERT INTO ai.intent_logs (intent, user_message, extracted_slots, session_id, user_id, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [intent, message, JSON.stringify(slots || {}), sessionId || null, userId || null]
  );
  return result.rows[0];
}

/**
 * Ghi log truy vấn tiện ích vào bảng ai.amenity_queries.
 * Chèn một dòng cho mỗi tiện ích.
 * @param {string[]} amenities - Danh sách tiện ích
 * @param {string} sessionId - UUID session
 * @returns {Promise<void>}
 */
async function insertAmenityQueries(amenities, sessionId) {
  if (!amenities || amenities.length === 0) return;
  const values = [];
  const placeholders = [];
  let idx = 0;
  for (const amenity of amenities) {
    values.push(amenity, sessionId || null);
    placeholders.push(`($${++idx}, $${++idx}, NOW())`);
  }
  await pool.query(
    `INSERT INTO ai.amenity_queries (amenity, session_id, created_at) VALUES ${placeholders.join(', ')}`,
    values
  );
}

/**
 * Ghi log click phòng vào bảng ai.room_clicks.
 * @param {number} roomTypeId - ID loại phòng
 * @param {number} userId - ID người dùng
 * @returns {Promise<object>} Row đã insert
 */
async function insertRoomClick(roomTypeId, userId) {
  const result = await pool.query(
    `INSERT INTO ai.room_clicks (room_type_id, user_id, clicked_at)
     VALUES ($1, $2, NOW())
     RETURNING *`,
    [roomTypeId, userId || null]
  );
  return result.rows[0];
}

/**
 * Lấy top intent phổ biến nhất cho analytics reporting.
 * @param {string} [from] - Ngày bắt đầu (ISO)
 * @param {string} [to] - Ngày kết thúc (ISO)
 * @returns {Promise<Array>} Top 10 intent kèm count
 */
async function getTopIntents(from, to) {
  const conditions = [];
  const values = [];
  let idx = 0;
  if (from) {
    values.push(from);
    conditions.push(`created_at >= $${++idx}`);
  }
  if (to) {
    values.push(to);
    conditions.push(`created_at <= $${++idx}`);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT intent, COUNT(*)::int AS count
     FROM ai.intent_logs
     ${whereClause}
     GROUP BY intent
     ORDER BY count DESC
     LIMIT 10`,
    values
  );
  return result.rows;
}

/**
 * Lấy top tiện ích được hỏi nhiều nhất.
 * @param {string} [from] - Ngày bắt đầu (ISO)
 * @param {string} [to] - Ngày kết thúc (ISO)
 * @returns {Promise<Array>} Top 10 amenity kèm count
 */
async function getTopAmenities(from, to) {
  const conditions = [];
  const values = [];
  let idx = 0;
  if (from) {
    values.push(from);
    conditions.push(`created_at >= $${++idx}`);
  }
  if (to) {
    values.push(to);
    conditions.push(`created_at <= $${++idx}`);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT amenity, COUNT(*)::int AS count
     FROM ai.amenity_queries
     ${whereClause}
     GROUP BY amenity
     ORDER BY count DESC
     LIMIT 10`,
    values
  );
  return result.rows;
}

/**
 * Lấy top phòng được click nhiều nhất.
 * JOIN hotel.room_types và hotel.hotels để lấy room_name, hotel_name.
 * @param {string} [from] - Ngày bắt đầu (ISO)
 * @param {string} [to] - Ngày kết thúc (ISO)
 * @returns {Promise<Array>} Top 10 phòng kèm room_name, hotel_name, count
 */
async function getTopRoomsClicked(from, to) {
  const conditions = [];
  const values = [];
  let idx = 0;
  if (from) {
    values.push(from);
    conditions.push(`rc.clicked_at >= $${++idx}`);
  }
  if (to) {
    values.push(to);
    conditions.push(`rc.clicked_at <= $${++idx}`);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT rc.room_type_id, r.name AS room_name, h.name AS hotel_name, COUNT(*)::int AS count
     FROM ai.room_clicks rc
     JOIN hotel.room_types r ON r.id = rc.room_type_id
     JOIN hotel.hotels h ON h.id = r.hotel_id
     ${whereClause}
     GROUP BY rc.room_type_id, r.name, h.name
     ORDER BY count DESC
     LIMIT 10`,
    values
  );
  return result.rows;
}

/**
 * Lấy thống kê hội thoại tổng hợp.
 * @param {string} [from] - Ngày bắt đầu (ISO)
 * @param {string} [to] - Ngày kết thúc (ISO)
 * @returns {Promise<object>} { totalConversations, totalMessages }
 */
async function getConversationStats(from, to) {
  const conditions = [];
  const values = [];
  let idx = 0;
  if (from) {
    values.push(from);
    conditions.push(`created_at >= $${++idx}`);
  }
  if (to) {
    values.push(to);
    conditions.push(`created_at <= $${++idx}`);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT
       COUNT(DISTINCT session_id)::int AS "totalConversations",
       COUNT(*)::int AS "totalMessages"
     FROM ai.intent_logs
     ${whereClause}`,
    values
  );
  return result.rows[0];
}

/**
 * Kiểm tra kết nối database tới schema ai.
 * @returns {Promise<boolean>} true nếu DB healthy, false nếu không
 */
async function checkDbHealth() {
  try {
    await pool.query('SELECT 1 FROM ai.intent_logs LIMIT 1');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  searchRooms,
  getCandidateRooms,
  getBookingCounts,
  getUserBookingHistory,
  findSimilarRooms,
  getTrendingRooms,
  getPreviousPeriodCounts,
  insertIntentLog,
  insertAmenityQueries,
  insertRoomClick,
  getTopIntents,
  getTopAmenities,
  getTopRoomsClicked,
  getConversationStats,
  checkDbHealth,
};
