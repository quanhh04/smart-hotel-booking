const pool = require('../../config/db.js');

async function searchRooms(filters) {
  const { min_price, max_price, guests, amenities, check_in, check_out, city } = filters || {};
//Ba biến dùng để build câu lệnh SQL
  const conditions = [];
  const values = [];
  let idx = 0;

  // Bộ lọc cơ bản
  if (min_price != null) { values.push(min_price); conditions.push(`r.price_per_night >= $${++idx}`); }
  if (max_price != null) { values.push(max_price); conditions.push(`r.price_per_night <= $${++idx}`); }
  if (guests != null)    { values.push(guests);    conditions.push(`r.max_guests >= $${++idx}`); }
  if (city)              { values.push(`%${city.toLowerCase()}%`); conditions.push(`LOWER(h.address) LIKE $${++idx}`); }

  // Lọc tiện ích: phòng phải có TẤT CẢ tiện ích yêu cầu
  let amenityJoin = ''; //tạo biến chứa JOIN
  let amenityHaving = '';
  if (amenities && amenities.length > 0) {
    values.push(amenities);//thêm danh sách tiện ích vào mảng values
    amenityJoin = `
      JOIN hotel.room_amenities ra2 ON ra2.room_type_id = r.id
      JOIN hotel.amenities a2 ON a2.id = ra2.amenity_id AND LOWER(a2.name) = ANY($${++idx})`;
    values.push(amenities.length);
    amenityHaving = `COUNT(DISTINCT LOWER(a2.name)) = $${++idx}`;//Đảm bảo phòng phải đủ tiện ích yêu cầu
  }

  // Lọc ngày còn trống: đếm booking trùng ngày, so với total_quantity
  let bookingJoin = '';
  let availSelect = ', r.total_quantity AS availability';
  let availHaving = '';
  if (check_in && check_out) {
    values.push(check_in); const ciIdx = ++idx;
    values.push(check_out); const coIdx = ++idx;
    bookingJoin = `
      LEFT JOIN booking.bookings b ON b.room_type_id = r.id
        AND b.status IN ('PENDING', 'CONFIRMED', 'PAID')
        AND NOT (b.check_out <= $${ciIdx} OR b.check_in >= $${coIdx})`;
    availSelect = ', r.total_quantity - COUNT(DISTINCT b.id) AS availability';
    availHaving = 'r.total_quantity - COUNT(DISTINCT b.id) > 0';
  }

  // Ghép HAVING
  const havingParts = [amenityHaving, availHaving].filter(Boolean);
  const having = havingParts.length > 0 ? `HAVING ${havingParts.join(' AND ')}` : '';
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
//Lấy danh sách phòng
  const query = `
    SELECT r.id AS room_id, r.name AS room_name, r.hotel_id,
           h.name AS hotel_name, h.address AS hotel_address,
           r.price_per_night, r.max_guests,
           COALESCE(ARRAY_AGG(DISTINCT a_all.name) FILTER (WHERE a_all.name IS NOT NULL), '{}') AS amenities
           ${availSelect}
    FROM hotel.room_types r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra_all ON ra_all.room_type_id = r.id
    LEFT JOIN hotel.amenities a_all ON a_all.id = ra_all.amenity_id
    ${amenityJoin} ${bookingJoin}
    ${where}
    GROUP BY r.id, r.name, r.hotel_id, r.price_per_night, r.max_guests, r.total_quantity, h.name, h.address
    ${having}
    ORDER BY r.price_per_night ASC
    LIMIT 10`;

  const result = await pool.query(query, values);
  return result.rows;
}

async function getCandidateRooms({ guests, max_price } = {}) {
  const conditions = [];
  const values = [];
  let idx = 0;

  if (guests != null)    { values.push(Number(guests));    conditions.push(`r.max_guests >= $${++idx}`); }
  if (max_price != null) { values.push(Number(max_price)); conditions.push(`r.price_per_night <= $${++idx} * 1.5`); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(`
    SELECT r.id AS room_id, r.name AS room_name, r.hotel_id,
           h.name AS hotel_name, h.address AS hotel_address,
           r.price_per_night, r.max_guests,
           COALESCE(h.rating, 0) AS hotel_rating,
           COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities
    FROM hotel.room_types r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra ON ra.room_type_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    ${where}
    GROUP BY r.id, r.name, r.hotel_id, h.name, h.address, r.price_per_night, r.max_guests, h.rating
    ORDER BY r.price_per_night ASC
    LIMIT 100`, values);
  return result.rows;
}
//Đếm số booking của từng loại phòng
async function getBookingCounts() {
  const result = await pool.query(`
    SELECT room_type_id, COUNT(*)::int AS booking_count
    FROM booking.bookings WHERE status IN ('CONFIRMED', 'PAID')
    GROUP BY room_type_id`);
  const map = new Map();
  for (const row of result.rows) map.set(row.room_type_id, row.booking_count);
  return map;
}

module.exports = { searchRooms, getCandidateRooms, getBookingCounts };
