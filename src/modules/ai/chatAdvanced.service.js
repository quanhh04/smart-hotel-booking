const pool = require('../../config/db');

const INTENTS = {
  SEARCH_ROOMS: 'SEARCH_ROOMS',
  GREET: 'GREET',
  PRICE_INFO: 'PRICE_INFO',
  AMENITY_INFO: 'AMENITY_INFO',
  BOOKING_HELP: 'BOOKING_HELP',
  UNKNOWN: 'UNKNOWN',
};

const KNOWN_AMENITIES = ['wifi', 'ac', 'pool', 'gym', 'breakfast'];

const detectIntent = (message) => {
  const normalizedMessage = message.toLowerCase();

  if (
    ['phòng', 'room', 'tìm', 'recommend', 'gợi ý'].some((keyword) =>
      normalizedMessage.includes(keyword),
    )
  ) {
    return INTENTS.SEARCH_ROOMS;
  }

  if (
    ['xin chào', 'hello', 'hi'].some((keyword) =>
      normalizedMessage.includes(keyword),
    )
  ) {
    return INTENTS.GREET;
  }

  if (
    ['bao nhiêu', 'giá', 'price'].some((keyword) =>
      normalizedMessage.includes(keyword),
    )
  ) {
    return INTENTS.PRICE_INFO;
  }

  if (
    ['wifi', 'điều hòa', 'ac', 'pool', 'bể bơi', 'gym'].some((keyword) =>
      normalizedMessage.includes(keyword),
    )
  ) {
    return INTENTS.AMENITY_INFO;
  }

  if (
    ['đặt', 'booking', 'check in', 'check out'].some((keyword) =>
      normalizedMessage.includes(keyword),
    )
  ) {
    return INTENTS.BOOKING_HELP;
  }

  return INTENTS.UNKNOWN;
};

const extractMaxPrice = (message) => {
  const normalizedMessage = message.toLowerCase();

  const thousandMatch = normalizedMessage.match(/(\d+(?:[\.,]\d+)?)\s*k\b/i);
  if (thousandMatch) {
    return Math.round(parseFloat(thousandMatch[1].replace(',', '.')) * 1000);
  }

  const millionMatch = normalizedMessage.match(/(\d+(?:[\.,]\d+)?)\s*triệu\b/i);
  if (millionMatch) {
    return Math.round(parseFloat(millionMatch[1].replace(',', '.')) * 1000000);
  }

  const plainMatch = normalizedMessage.match(/\b(\d{3,})\b/);
  if (plainMatch) {
    return Number(plainMatch[1]);
  }

  return undefined;
};

const extractGuests = (message) => {
  const guestMatch = message.toLowerCase().match(/\b(\d+)\s*người\b/i);
  if (!guestMatch) {
    return undefined;
  }

  return Number(guestMatch[1]);
};

const extractAmenities = (message) => {
  const normalizedMessage = message.toLowerCase();
  const aliases = {
    wifi: ['wifi'],
    ac: ['ac', 'điều hòa'],
    pool: ['pool', 'bể bơi'],
    gym: ['gym'],
    breakfast: ['breakfast'],
  };

  return KNOWN_AMENITIES.filter((amenity) =>
    aliases[amenity].some((keyword) => normalizedMessage.includes(keyword)),
  );
};

const extractCity = (message) => {
  const normalizedMessage = message.toLowerCase();
  const cityMap = {
    'đà nẵng': 'đà nẵng',
    'hà nội': 'hà nội',
    hcm: 'hcm',
    'sài gòn': 'sài gòn',
  };

  return Object.keys(cityMap).find((keyword) => normalizedMessage.includes(keyword));
};

const extractSlots = (message) => {
  const amenities = extractAmenities(message);

  return {
    maxPrice: extractMaxPrice(message),
    guests: extractGuests(message),
    amenities,
    city: extractCity(message),
  };
};

const buildSearchQuery = ({ guests, maxPrice, amenities, city }) => {
  const values = [];
  const filters = [];

  if (guests !== undefined) {
    values.push(guests);
    filters.push(`r.max_guests >= $${values.length}`);
  }

  if (maxPrice !== undefined) {
    values.push(maxPrice);
    filters.push(`r.price_per_night <= $${values.length}`);
  }

  if (city) {
    values.push(`%${city}%`);
    filters.push(`LOWER(h.address) LIKE $${values.length}`);
  }

  if (amenities.length > 0) {
    values.push(amenities);
    filters.push(`a.name = ANY($${values.length})`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  let havingClause = '';
  if (amenities.length > 0) {
    values.push(amenities.length);
    havingClause = `HAVING COUNT(DISTINCT a.name) = $${values.length}`;
  }

  const query = `
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      h.name AS hotel_name,
      r.price_per_night,
      COALESCE(ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '{}') AS amenities
    FROM hotel.rooms r
    JOIN hotel.hotels h ON h.id = r.hotel_id
    LEFT JOIN hotel.room_amenities ra ON ra.room_id = r.id
    LEFT JOIN hotel.amenities a ON a.id = ra.amenity_id
    ${whereClause}
    GROUP BY r.id, h.name
    ${havingClause}
    ORDER BY r.price_per_night ASC
    LIMIT 5
  `;

  return { query, values };
};

const buildNonSearchReply = (intent) => {
  switch (intent) {
    case INTENTS.GREET:
      return 'Xin chào! Mình có thể giúp bạn tìm phòng phù hợp theo ngân sách và tiện ích.';
    case INTENTS.PRICE_INFO:
      return 'Bạn có thể gửi ngân sách mong muốn, ví dụ: "phòng dưới 800k".';
    case INTENTS.AMENITY_INFO:
      return 'Mình có thể hỗ trợ lọc phòng theo tiện ích như wifi, điều hòa, hồ bơi, gym hoặc breakfast.';
    case INTENTS.BOOKING_HELP:
      return 'Để đặt phòng, bạn có thể gửi nhu cầu gồm ngày check in/check out, số người và ngân sách.';
    default:
      return 'Mình chưa hiểu rõ yêu cầu. Bạn có thể nói rõ hơn về phòng bạn muốn tìm không?';
  }
};

const buildSearchReply = (results) => {
  if (!results.length) {
    return 'Mình chưa tìm thấy phòng phù hợp với tiêu chí của bạn. Bạn thử nới ngân sách hoặc giảm bớt tiện ích nhé.';
  }

  return `Mình đã tìm thấy ${results.length} phòng phù hợp với yêu cầu của bạn.`;
};

const chatAdvanced = async (message) => {
  const intent = detectIntent(message);
  const slots = extractSlots(message);

  if (intent !== INTENTS.SEARCH_ROOMS) {
    return {
      intent,
      slots,
      reply: buildNonSearchReply(intent),
    };
  }

  const { query, values } = buildSearchQuery(slots);
  const result = await pool.query(query, values);

  return {
    intent,
    slots,
    reply: buildSearchReply(result.rows),
    results: result.rows,
  };
};

module.exports = {
  chatAdvanced,
};
