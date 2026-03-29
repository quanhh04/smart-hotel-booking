const createLogger = require('../../common/helpers/logger.js');
const model = require('./ai.model.js');

const log = createLogger('ai.service');

// ─── Intent Detector ────────────────────────────────────────────────────────

const INTENTS = {
  SEARCH_ROOMS: 'SEARCH_ROOMS',
  GREET: 'GREET',
  PRICE_INFO: 'PRICE_INFO',
  AMENITY_INFO: 'AMENITY_INFO',
  BOOKING_HELP: 'BOOKING_HELP',
  HOTEL_INFO: 'HOTEL_INFO',
  ROOM_DETAIL: 'ROOM_DETAIL',
  CANCEL_HELP: 'CANCEL_HELP',
  THANK: 'THANK',
  UNKNOWN: 'UNKNOWN',
};

const INTENT_KEYWORDS = {
  [INTENTS.SEARCH_ROOMS]: [
    'phòng', 'tìm phòng', 'có phòng nào', 'gợi ý phòng', 'đề xuất',
    'recommend', 'search', 'room', 'tìm kiếm', 'đặt phòng',
    'book room', 'available room', 'phòng trống',
  ],
  [INTENTS.GREET]: [
    'xin chào', 'chào', 'hello', 'hi', 'hey', 'chào bạn', 'alo',
    'helu', 'good morning', 'good afternoon', 'chào buổi sáng',
    'chào buổi chiều',
  ],
  [INTENTS.PRICE_INFO]: [
    'giá', 'bao nhiêu', 'chi phí', 'price', 'cost', 'giá phòng',
    'bảng giá', 'giá cả', 'mức giá', 'how much', 'giá tiền',
    'phí', 'rate',
  ],
  [INTENTS.AMENITY_INFO]: [
    'tiện ích', 'tiện nghi', 'amenity', 'amenities', 'dịch vụ',
    'có wifi không', 'hồ bơi', 'bể bơi', 'pool', 'điều hòa',
    'máy lạnh', 'facility', 'facilities',
  ],
  [INTENTS.BOOKING_HELP]: [
    'đặt', 'booking', 'book', 'đặt chỗ', 'reservation', 'reserve',
    'cách đặt', 'hướng dẫn đặt', 'quy trình đặt', 'làm sao đặt',
    'muốn đặt', 'how to book',
  ],
  [INTENTS.HOTEL_INFO]: [
    'khách sạn', 'hotel', 'thông tin khách sạn', 'hotel info',
    'về khách sạn', 'địa chỉ', 'address', 'location', 'vị trí',
    'ở đâu', 'where', 'nằm ở',
  ],
  [INTENTS.ROOM_DETAIL]: [
    'chi tiết phòng', 'room detail', 'thông tin phòng', 'mô tả phòng',
    'phòng như thế nào', 'room info', 'loại phòng', 'room type',
    'diện tích', 'sức chứa', 'capacity',
  ],
  [INTENTS.CANCEL_HELP]: [
    'hủy', 'cancel', 'hủy đặt', 'hủy phòng', 'cancellation',
    'hoàn tiền', 'refund', 'trả phòng', 'không đặt nữa',
    'hủy booking', 'cancel booking',
  ],
  [INTENTS.THANK]: [
    'cảm ơn', 'thank', 'thanks', 'thank you', 'cám ơn', 'tks',
    'thankful', 'biết ơn', 'cảm tạ', 'nhiều lắm', 'great',
    'tuyệt vời',
  ],
};

/**
 * Phân loại tin nhắn vào 1 trong 10 intent bằng keyword matching.
 * Chuẩn hóa lowercase + trim trước khi so khớp.
 * Khi nhiều intent khớp, chọn intent có nhiều keyword match nhất.
 * @param {string} message - Tin nhắn người dùng
 * @returns {{ intent: string, matchCount: number }}
 */
function detectIntent(message) {
  const normalized = (message || '').toLowerCase().trim();

  if (!normalized) {
    return { intent: INTENTS.UNKNOWN, matchCount: 0 };
  }

  let bestIntent = INTENTS.UNKNOWN;
  let bestCount = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount > bestCount) {
      bestCount = matchCount;
      bestIntent = intent;
    }
  }

  return { intent: bestIntent, matchCount: bestCount };
}

// ─── Slot Extractor ──────────────────────────────────────────────────────────

/**
 * Từ điển tiện ích: mapping aliases (tiếng Việt + tiếng Anh) → tên canonical.
 */
const AMENITY_DICT = {
  'wifi': 'wifi',
  'hồ bơi': 'pool',
  'bể bơi': 'pool',
  'pool': 'pool',
  'điều hòa': 'ac',
  'máy lạnh': 'ac',
  'ac': 'ac',
  'bãi đỗ xe': 'parking',
  'parking': 'parking',
  'nhà hàng': 'restaurant',
  'restaurant': 'restaurant',
  'phòng gym': 'gym',
  'gym': 'gym',
  'bữa sáng': 'breakfast',
  'breakfast': 'breakfast',
  'minibar': 'minibar',
  'ban công': 'balcony',
  'balcony': 'balcony',
  'bồn tắm': 'bathtub',
  'bathtub': 'bathtub',
  'két sắt': 'safe',
  'safe': 'safe',
  'truyền hình cáp': 'cable tv',
  'cable tv': 'cable tv',
  'máy giặt': 'laundry',
  'laundry': 'laundry',
  'spa': 'spa',
  'bar': 'bar',
  'thang máy': 'elevator',
  'elevator': 'elevator',
  'lễ tân 24h': '24h reception',
  '24h reception': '24h reception',
  'đưa đón sân bay': 'airport shuttle',
  'airport shuttle': 'airport shuttle',
  'phòng họp': 'meeting room',
  'meeting room': 'meeting room',
  'dịch vụ phòng': 'room service',
  'room service': 'room service',
};

/**
 * Từ điển thành phố: mapping aliases → tên canonical.
 */
const CITY_DICT = {
  'sài gòn': 'Hồ Chí Minh',
  'hcm': 'Hồ Chí Minh',
  'hồ chí minh': 'Hồ Chí Minh',
  'tp hcm': 'Hồ Chí Minh',
  'tp.hcm': 'Hồ Chí Minh',
  'hà nội': 'Hà Nội',
  'ha noi': 'Hà Nội',
  'đà nẵng': 'Đà Nẵng',
  'da nang': 'Đà Nẵng',
  'nha trang': 'Nha Trang',
  'đà lạt': 'Đà Lạt',
  'da lat': 'Đà Lạt',
  'phú quốc': 'Phú Quốc',
  'phu quoc': 'Phú Quốc',
  'huế': 'Huế',
  'hue': 'Huế',
  'hội an': 'Hội An',
  'hoi an': 'Hội An',
  'hạ long': 'Hạ Long',
  'ha long': 'Hạ Long',
  'vũng tàu': 'Vũng Tàu',
  'vung tau': 'Vũng Tàu',
};

/**
 * Parse giá trị số từ chuỗi giá tiếng Việt.
 * Hỗ trợ: "500k", "1.5 triệu", "1,500,000", "500000"
 * @param {string} str - Chuỗi chứa giá trị số
 * @returns {number|null}
 */
function parsePrice(str) {
  if (!str) return null;
  const s = str.trim().toLowerCase();

  // "1.5 triệu", "1,5 triệu", "2 triệu"
  const trieuMatch = s.match(/^([\d.,]+)\s*triệu$/);
  if (trieuMatch) {
    const num = parseFloat(trieuMatch[1].replace(',', '.'));
    return isNaN(num) ? null : num * 1000000;
  }

  // "500k", "1.5k"
  const kMatch = s.match(/^([\d.,]+)\s*k$/);
  if (kMatch) {
    const num = parseFloat(kMatch[1].replace(',', '.'));
    return isNaN(num) ? null : num * 1000;
  }

  // "1,500,000" or "500000"
  const cleaned = s.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Trích xuất giá (min_price, max_price) từ tin nhắn.
 * Hỗ trợ: "dưới 800k", "trên 500k", "từ 500k đến 1 triệu", single price.
 * @param {string} message - Tin nhắn đã lowercase
 * @returns {{ min_price: number|null, max_price: number|null }}
 */
function extractPrice(message) {
  let min_price = null;
  let max_price = null;

  // "từ A đến B" / "từ A tới B"
  const rangeMatch = message.match(/từ\s+([\d.,]+\s*(?:k|triệu)?)\s*(?:đến|tới)\s+([\d.,]+\s*(?:k|triệu)?)/);
  if (rangeMatch) {
    min_price = parsePrice(rangeMatch[1]);
    max_price = parsePrice(rangeMatch[2]);
    return { min_price, max_price };
  }

  // "dưới X"
  const underMatch = message.match(/dưới\s+([\d.,]+\s*(?:k|triệu)?)/);
  if (underMatch) {
    max_price = parsePrice(underMatch[1]);
    return { min_price, max_price };
  }

  // "trên X"
  const overMatch = message.match(/trên\s+([\d.,]+\s*(?:k|triệu)?)/);
  if (overMatch) {
    min_price = parsePrice(overMatch[1]);
    return { min_price, max_price };
  }

  // Single price with explicit unit (k or triệu) — must have unit to avoid
  // matching stray numbers from guest/date expressions
  const withUnitMatch = message.match(/([\d.,]+)\s*(k|triệu)/);
  if (withUnitMatch) {
    // Ensure the "k" is not part of "khách" or similar words
    const afterIdx = withUnitMatch.index + withUnitMatch[0].length;
    const charAfter = message[afterIdx] || '';
    if (withUnitMatch[2] === 'k' && /[a-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/i.test(charAfter)) {
      // "k" is part of a word like "khách", skip
    } else {
      const raw = withUnitMatch[1] + withUnitMatch[2];
      const val = parsePrice(raw);
      if (val !== null && val > 0) {
        max_price = val;
      }
    }
    return { min_price, max_price };
  }

  // Large plain number (≥ 100000) — likely a price like "1,500,000" or "500000"
  const plainMatch = message.match(/([\d,]{6,})/);
  if (plainMatch) {
    const val = parsePrice(plainMatch[1]);
    if (val !== null && val >= 100000) {
      max_price = val;
    }
  }

  return { min_price, max_price };
}

/**
 * Trích xuất số khách từ tin nhắn.
 * Hỗ trợ: "2 người", "cho 3 khách", "4 người lớn"
 * @param {string} message - Tin nhắn đã lowercase
 * @returns {number|null}
 */
function extractGuests(message) {
  const match = message.match(/(?:cho\s+)?(\d+)\s*(?:người|khách|người lớn)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Trích xuất tiện ích từ tin nhắn bằng từ điển AMENITY_DICT.
 * @param {string} message - Tin nhắn đã lowercase
 * @returns {string[]|null} Mảng tên canonical, hoặc null nếu không tìm thấy
 */
function extractAmenities(message) {
  const found = new Set();
  // Sort keys by length descending so longer phrases match first
  const sortedKeys = Object.keys(AMENITY_DICT).sort((a, b) => b.length - a.length);
  for (const alias of sortedKeys) {
    if (message.includes(alias)) {
      found.add(AMENITY_DICT[alias]);
    }
  }
  return found.size > 0 ? [...found] : null;
}

/**
 * Trích xuất ngày check-in / check-out từ tin nhắn.
 * Hỗ trợ: "ngày 15/6", "15-06-2025", "ngày mai", "tuần sau", "cuối tuần này"
 * @param {string} message - Tin nhắn đã lowercase
 * @returns {{ check_in: string|null, check_out: string|null }} ISO date strings
 */
function extractDates(message) {
  let check_in = null;
  let check_out = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Format Date to YYYY-MM-DD string.
   */
  function toISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // "cuối tuần này" → Saturday-Sunday of current week
  if (message.includes('cuối tuần này') || message.includes('cuối tuần')) {
    const dayOfWeek = today.getDay(); // 0=Sun
    const satOffset = 6 - dayOfWeek;
    const sat = new Date(today);
    sat.setDate(today.getDate() + satOffset);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return { check_in: toISO(sat), check_out: toISO(sun) };
  }

  // "tuần sau" → Monday-Sunday of next week
  if (message.includes('tuần sau')) {
    const dayOfWeek = today.getDay(); // 0=Sun
    const monOffset = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const mon = new Date(today);
    mon.setDate(today.getDate() + monOffset);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { check_in: toISO(mon), check_out: toISO(sun) };
  }

  // "ngày mai"
  if (message.includes('ngày mai')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    check_in = toISO(tomorrow);
    return { check_in, check_out };
  }

  // "DD-MM-YYYY" or "DD/MM/YYYY"
  const fullDateRegex = /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/g;
  const fullDates = [];
  let m;
  while ((m = fullDateRegex.exec(message)) !== null) {
    const d = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
    if (!isNaN(d.getTime())) {
      fullDates.push(toISO(d));
    }
  }
  if (fullDates.length >= 2) {
    return { check_in: fullDates[0], check_out: fullDates[1] };
  }
  if (fullDates.length === 1) {
    return { check_in: fullDates[0], check_out: null };
  }

  // "ngày DD/MM" (no year → current year)
  const shortDateRegex = /ngày\s+(\d{1,2})[/](\d{1,2})/g;
  const shortDates = [];
  while ((m = shortDateRegex.exec(message)) !== null) {
    const d = new Date(today.getFullYear(), parseInt(m[2]) - 1, parseInt(m[1]));
    if (!isNaN(d.getTime())) {
      shortDates.push(toISO(d));
    }
  }
  if (shortDates.length >= 2) {
    return { check_in: shortDates[0], check_out: shortDates[1] };
  }
  if (shortDates.length === 1) {
    return { check_in: shortDates[0], check_out: null };
  }

  return { check_in, check_out };
}

/**
 * Trích xuất thành phố từ tin nhắn bằng từ điển CITY_DICT.
 * @param {string} message - Tin nhắn đã lowercase
 * @returns {string|null} Tên thành phố canonical, hoặc null
 */
function extractCity(message) {
  // Sort keys by length descending so longer phrases match first
  const sortedKeys = Object.keys(CITY_DICT).sort((a, b) => b.length - a.length);
  for (const alias of sortedKeys) {
    if (message.includes(alias)) {
      return CITY_DICT[alias];
    }
  }
  return null;
}

/**
 * Trích xuất tất cả slot từ tin nhắn người dùng.
 * Luôn trả về object đầy đủ 7 trường (null khi không phát hiện).
 * @param {string} message - Tin nhắn người dùng
 * @returns {{ min_price: number|null, max_price: number|null, guests: number|null, amenities: string[]|null, check_in: string|null, check_out: string|null, city: string|null }}
 */
function extractSlots(message) {
  const normalized = (message || '').toLowerCase().trim();

  const { min_price, max_price } = extractPrice(normalized);
  const guests = extractGuests(normalized);
  const amenities = extractAmenities(normalized);
  const { check_in, check_out } = extractDates(normalized);
  const city = extractCity(normalized);

  return { min_price, max_price, guests, amenities, check_in, check_out, city };
}

// ─── Conversation Manager ─────────────────────────────────────────────────────

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 phút
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 phút
const MAX_HISTORY_PAIRS = 10;

/** @type {Map<string, { slots: object, history: Array<{role: string, content: string}>, lastActivity: number }>} */
const sessions = new Map();

/**
 * Truy xuất ngữ cảnh hội thoại hiện có cho session.
 * @param {string} sessionId - UUID session
 * @returns {{ slots: object, history: Array, lastActivity: number } | null}
 */
function getContext(sessionId) {
  if (!sessionId) return null;
  const ctx = sessions.get(sessionId);
  if (!ctx) return null;
  ctx.lastActivity = Date.now();
  return ctx;
}

/**
 * Gộp slot mới với slot đã lưu. Giá trị mới non-null ghi đè, null giữ nguyên.
 * @param {string} sessionId - UUID session
 * @param {object} newSlots - Slot mới trích xuất
 * @returns {object} Slot đã gộp
 */
function mergeSlots(sessionId, newSlots) {
  if (!sessionId) return { ...newSlots };

  let ctx = sessions.get(sessionId);
  if (!ctx) {
    ctx = { slots: {}, history: [], lastActivity: Date.now() };
    sessions.set(sessionId, ctx);
  }

  const merged = { ...ctx.slots };
  for (const key of Object.keys(newSlots)) {
    if (newSlots[key] !== null && newSlots[key] !== undefined) {
      merged[key] = newSlots[key];
    }
  }
  ctx.slots = merged;
  ctx.lastActivity = Date.now();
  return merged;
}

/**
 * Lưu cặp tin nhắn (user + bot) vào history, giới hạn 10 cặp.
 * @param {string} sessionId - UUID session
 * @param {string} userMsg - Tin nhắn người dùng
 * @param {string} botReply - Phản hồi bot
 */
function saveMessage(sessionId, userMsg, botReply) {
  if (!sessionId) return;

  let ctx = sessions.get(sessionId);
  if (!ctx) {
    ctx = { slots: {}, history: [], lastActivity: Date.now() };
    sessions.set(sessionId, ctx);
  }

  ctx.history.push({ role: 'user', content: userMsg });
  ctx.history.push({ role: 'bot', content: botReply });

  // Giới hạn 10 cặp = 20 entries
  while (ctx.history.length > MAX_HISTORY_PAIRS * 2) {
    ctx.history.shift();
    ctx.history.shift();
  }

  ctx.lastActivity = Date.now();
}

/**
 * Đếm số session đang hoạt động.
 * @returns {number}
 */
function getActiveSessionCount() {
  return sessions.size;
}

/**
 * Xóa session không hoạt động >30 phút.
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [id, ctx] of sessions) {
    if (now - ctx.lastActivity > SESSION_TIMEOUT_MS) {
      sessions.delete(id);
    }
  }
}

// Chạy cleanup mỗi 5 phút
const _cleanupTimer = setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL_MS);
// Cho phép process thoát mà không bị giữ bởi timer
if (_cleanupTimer.unref) _cleanupTimer.unref();

// ─── Response Builder ──────────────────────────────────────────────────────────

/**
 * Format giá VND cho hiển thị.
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  if (price >= 1000000) {
    const m = price / 1000000;
    return Number.isInteger(m) ? `${m} triệu` : `${m.toFixed(1)} triệu`;
  }
  if (price >= 1000) {
    const k = price / 1000;
    return Number.isInteger(k) ? `${k}k` : `${k.toFixed(0)}k`;
  }
  return `${price}`;
}

/**
 * Format danh sách phòng thành chuỗi tiếng Việt.
 * @param {Array} rooms
 * @returns {string}
 */
function formatRoomList(rooms) {
  return rooms.map((r, i) => {
    const amenities = Array.isArray(r.amenities) && r.amenities.length > 0
      ? r.amenities.join(', ')
      : 'Không có thông tin';
    return `${i + 1}. ${r.room_name} - ${r.hotel_name}\n   Giá: ${formatPrice(r.price_per_night)}/đêm | Sức chứa: ${r.max_guests} khách | Tiện ích: ${amenities}`;
  }).join('\n');
}

/**
 * Tạo phản hồi tiếng Việt dựa trên intent và kết quả.
 * @param {string} intent - Intent đã phát hiện
 * @param {Array} results - Kết quả tìm kiếm phòng (nếu có)
 * @param {object} slots - Slot đã trích xuất
 * @returns {string} Phản hồi tiếng Việt
 */
function buildResponse(intent, results, slots) {
  switch (intent) {
    case INTENTS.GREET:
      return 'Xin chào! Mình là trợ lý đặt phòng khách sạn. Mình có thể giúp bạn tìm phòng, xem giá, kiểm tra tiện ích, hoặc hỗ trợ đặt phòng. Bạn cần gì nào?';

    case INTENTS.SEARCH_ROOMS:
      if (results && results.length > 0) {
        return `Mình tìm thấy ${results.length} phòng phù hợp với yêu cầu của bạn:\n\n${formatRoomList(results)}\n\nBạn muốn xem chi tiết phòng nào không?`;
      }
      return 'Rất tiếc, mình không tìm thấy phòng nào phù hợp với tiêu chí của bạn. Bạn thử mở rộng khoảng giá, giảm số khách, hoặc bớt tiện ích yêu cầu xem sao nhé!';

    case INTENTS.PRICE_INFO:
      if (results && results.length > 0) {
        const prices = results.map(r => r.price_per_night).sort((a, b) => a - b);
        return `Khoảng giá phòng hiện có: từ ${formatPrice(prices[0])} đến ${formatPrice(prices[prices.length - 1])}/đêm. Mình tìm thấy ${results.length} phòng. Bạn muốn xem chi tiết không?`;
      }
      return 'Hiện tại mình chưa có thông tin giá phòng phù hợp. Bạn cho mình biết thêm về khu vực hoặc loại phòng bạn quan tâm nhé!';

    case INTENTS.AMENITY_INFO:
      if (results && results.length > 0) {
        const allAmenities = new Set();
        results.forEach(r => {
          if (Array.isArray(r.amenities)) r.amenities.forEach(a => allAmenities.add(a));
        });
        if (allAmenities.size > 0) {
          return `Các tiện ích có sẵn tại các khách sạn: ${[...allAmenities].join(', ')}. Bạn muốn tìm phòng có tiện ích cụ thể nào không?`;
        }
      }
      return 'Các khách sạn của chúng tôi cung cấp nhiều tiện ích như wifi, hồ bơi, điều hòa, bãi đỗ xe, nhà hàng, phòng gym, spa và nhiều hơn nữa. Bạn quan tâm tiện ích nào?';

    case INTENTS.BOOKING_HELP:
      return 'Để đặt phòng, bạn có thể cho mình biết: thành phố, ngày check-in/check-out, số khách, và khoảng giá mong muốn. Mình sẽ tìm phòng phù hợp cho bạn!';

    case INTENTS.HOTEL_INFO:
      if (results && results.length > 0) {
        const hotels = [...new Set(results.map(r => `${r.hotel_name} (${r.hotel_address})`))];
        return `Thông tin khách sạn:\n${hotels.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nBạn muốn xem phòng của khách sạn nào?`;
      }
      return 'Bạn muốn tìm hiểu về khách sạn ở khu vực nào? Cho mình biết thành phố hoặc địa điểm bạn quan tâm nhé!';

    case INTENTS.ROOM_DETAIL:
      if (results && results.length > 0) {
        return `Thông tin chi tiết phòng:\n\n${formatRoomList(results)}\n\nBạn muốn đặt phòng nào?`;
      }
      return 'Bạn muốn xem chi tiết phòng nào? Cho mình biết tên phòng hoặc khách sạn bạn quan tâm nhé!';

    case INTENTS.CANCEL_HELP:
      return 'Để hủy đặt phòng, bạn vui lòng liên hệ bộ phận hỗ trợ hoặc vào mục "Đặt phòng của tôi" để thực hiện hủy. Chính sách hoàn tiền tùy thuộc vào từng khách sạn.';

    case INTENTS.THANK:
      return 'Không có gì! Rất vui được hỗ trợ bạn. Nếu cần thêm gì, cứ hỏi mình nhé!';

    case INTENTS.UNKNOWN:
    default:
      return 'Mình có thể giúp bạn:\n- Tìm kiếm phòng khách sạn\n- Xem giá phòng\n- Kiểm tra tiện ích\n- Hỗ trợ đặt phòng\n- Thông tin khách sạn\n- Hủy đặt phòng\n\nBạn muốn hỏi về vấn đề gì?';
  }
}

// ─── Chat Handler ─────────────────────────────────────────────────────────────

/**
 * Xử lý tin nhắn chat: detect intent → extract slots → search → build response.
 * @param {string} message - Tin nhắn người dùng
 * @param {string} sessionId - UUID session (optional)
 * @param {number} userId - ID người dùng (optional)
 * @returns {Promise<object>} { intent, slots, context, reply, results }
 */
async function chat(message, sessionId, userId) {
  log.info('chat: processing message', { sessionId, userId });

  // 1. Get existing conversation context
  const existingCtx = getContext(sessionId);

  // 2. Detect intent
  const { intent } = detectIntent(message);

  // 3. Extract slots from message
  const newSlots = extractSlots(message);

  // 4. Merge slots with existing context
  const mergedSlots = mergeSlots(sessionId, newSlots);

  // 5. Search rooms if intent requires it
  let results = [];
  const searchIntents = [INTENTS.SEARCH_ROOMS, INTENTS.PRICE_INFO, INTENTS.AMENITY_INFO, INTENTS.HOTEL_INFO, INTENTS.ROOM_DETAIL];
  if (searchIntents.includes(intent)) {
    try {
      results = await model.searchRooms(mergedSlots);
    } catch (err) {
      log.error('chat: searchRooms failed', { error: err.message });
      results = [];
    }
  }

  // 6. Build Vietnamese response
  const reply = buildResponse(intent, results, mergedSlots);

  // 7. Log analytics (fire-and-forget — never block response)
  Promise.resolve().then(async () => {
    try {
      await model.insertIntentLog({ intent, message, slots: mergedSlots, sessionId, userId });
      if (mergedSlots.amenities && mergedSlots.amenities.length > 0) {
        await model.insertAmenityQueries(mergedSlots.amenities, sessionId);
      }
    } catch (err) {
      log.error('chat: analytics logging failed', { error: err.message });
    }
  });

  // 8. Save message to conversation history
  saveMessage(sessionId, message, reply);

  // 9. Build context summary
  const ctx = getContext(sessionId);
  const messageCount = ctx ? ctx.history.length / 2 : 1;

  return {
    intent,
    slots: mergedSlots,
    context: {
      session_id: sessionId || null,
      message_count: messageCount,
    },
    reply,
    results: results.length > 0 ? results : undefined,
  };
}

/**
 * Gợi ý phòng dựa trên sở thích người dùng (scoring 5 chiều).
 * @param {object} params - { guests, max_price, amenities, limit }
 * @returns {Promise<Array>} Danh sách phòng gợi ý kèm score và why
 */
async function getRecommendations({ guests, max_price, amenities, limit }) {
  log.info('getRecommendations: fetching', { guests, max_price, amenities, limit });

  const effectiveLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
  const requestedGuests = guests != null ? Number(guests) : null;
  const requestedMaxPrice = max_price != null ? Number(max_price) : null;
  const requestedAmenities = amenities
    ? amenities.split(',').map(a => a.trim().toLowerCase()).filter(Boolean)
    : [];

  const [candidates, bookingCounts] = await Promise.all([
    model.getCandidateRooms({ guests: requestedGuests, max_price: requestedMaxPrice }),
    model.getBookingCounts(),
  ]);

  if (candidates.length === 0) return [];

  // Find max booking count across all candidates for popularity normalization
  let maxBookingCount = 0;
  for (const room of candidates) {
    const count = bookingCounts.get(room.room_id) || 0;
    if (count > maxBookingCount) maxBookingCount = count;
  }
  if (maxBookingCount === 0) maxBookingCount = 1;

  // Score each candidate
  const scored = candidates.map(room => {
    const roomAmenities = (room.amenities || []).map(a => a.toLowerCase());

    // price_fit (30%)
    let priceFit = 0;
    if (requestedMaxPrice != null && requestedMaxPrice > 0) {
      priceFit = Math.max(0, Math.min((requestedMaxPrice - room.price_per_night) / requestedMaxPrice, 1)) * 0.30;
    } else {
      priceFit = 0.15; // neutral when no price preference
    }

    // guest_fit (15%)
    let guestFit = 0;
    if (requestedGuests != null) {
      if (room.max_guests < requestedGuests) {
        guestFit = 0;
      } else {
        guestFit = Math.max(0, Math.min(requestedGuests / room.max_guests, 1)) * 0.15;
      }
    } else {
      guestFit = 0.075; // neutral
    }

    // amenity_match (25%)
    let amenityMatch = 0;
    if (requestedAmenities.length > 0) {
      const matched = requestedAmenities.filter(a => roomAmenities.includes(a)).length;
      amenityMatch = (matched / requestedAmenities.length) * 0.25;
    } else {
      amenityMatch = 0.125; // neutral
    }

    // popularity (15%)
    const roomBookings = bookingCounts.get(room.room_id) || 0;
    const popularity = (roomBookings / maxBookingCount) * 0.15;

    // review_rating (15%)
    const reviewRating = ((room.hotel_rating || 0) / 5) * 0.15;

    const score = priceFit + guestFit + amenityMatch + popularity + reviewRating;

    return {
      room_id: room.room_id,
      room_name: room.room_name,
      hotel_id: room.hotel_id,
      hotel_name: room.hotel_name,
      hotel_address: room.hotel_address,
      price_per_night: room.price_per_night,
      max_guests: room.max_guests,
      amenities: room.amenities,
      score: Math.round(score * 100) / 100,
      why: {
        price_fit: Math.round(priceFit * 100) / 100,
        guest_fit: Math.round(guestFit * 100) / 100,
        amenity_match: Math.round(amenityMatch * 100) / 100,
        popularity: Math.round(popularity * 100) / 100,
        review_rating: Math.round(reviewRating * 100) / 100,
      },
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Diversify: max 2 rooms per hotel
  const hotelCount = {};
  const diversified = [];
  for (const room of scored) {
    const hid = room.hotel_id;
    hotelCount[hid] = (hotelCount[hid] || 0) + 1;
    if (hotelCount[hid] <= 2) {
      diversified.push(room);
    }
    if (diversified.length >= effectiveLimit) break;
  }

  return diversified;
}

/**
 * Lấy danh sách phòng trending/hot theo số booking gần đây.
 * @param {number} days - Số ngày tính trending (7-30)
 * @returns {Promise<Array>} Danh sách phòng trending
 */
async function getTrending(days) {
  const effectiveDays = Math.min(Math.max(Number(days) || 7, 7), 30);
  log.info('getTrending: fetching', { days: effectiveDays });

  const [trendingRooms, previousCounts] = await Promise.all([
    model.getTrendingRooms(effectiveDays),
    model.getPreviousPeriodCounts(effectiveDays),
  ]);

  // Diversify: max 2 rooms per hotel
  const hotelCount = {};
  const diversified = [];
  for (const room of trendingRooms) {
    const hid = room.hotel_id;
    hotelCount[hid] = (hotelCount[hid] || 0) + 1;
    if (hotelCount[hid] <= 2) {
      const prevCount = previousCounts.get(room.room_id) || 0;
      let percentChange = 0;
      if (prevCount > 0) {
        percentChange = Math.round(((room.booking_count - prevCount) / prevCount) * 100);
      } else if (room.booking_count > 0) {
        percentChange = 100; // new trending
      }

      diversified.push({
        room_id: room.room_id,
        room_name: room.room_name,
        hotel_name: room.hotel_name,
        hotel_address: room.hotel_address,
        price_per_night: room.price_per_night,
        max_guests: room.max_guests,
        amenities: room.amenities,
        booking_count: room.booking_count,
        percent_change: percentChange,
      });
    }
    if (diversified.length >= 10) break;
  }

  return diversified;
}

/**
 * Gợi ý phòng dựa trên lịch sử booking của user.
 * @param {number} userId - ID người dùng
 * @returns {Promise<object>} { recommendations, message }
 */
async function getHistoryBased(userId) {
  log.info('getHistoryBased: fetching', { userId });

  const bookings = await model.getUserBookingHistory(userId);

  if (bookings.length === 0) {
    return {
      recommendations: [],
      message: 'Bạn chưa có lịch sử đặt phòng. Hãy đặt phòng để nhận gợi ý phù hợp với sở thích của bạn.',
    };
  }

  // Analyze booking history
  const prices = bookings.map(b => Number(b.price_per_night));
  const avgPrice = prices.reduce((s, p) => s + p, 0) / prices.length;

  // Most common max_guests
  const guestFreq = {};
  for (const b of bookings) {
    const g = b.max_guests;
    guestFreq[g] = (guestFreq[g] || 0) + 1;
  }
  const commonMaxGuests = Number(Object.entries(guestFreq).sort((a, b) => b[1] - a[1])[0][0]);

  // Frequent cities (extract from hotel_address)
  const cityFreq = {};
  for (const b of bookings) {
    const addr = (b.hotel_address || '').toLowerCase();
    if (addr) {
      cityFreq[addr] = (cityFreq[addr] || 0) + 1;
    }
  }
  const cities = Object.entries(cityFreq).sort((a, b) => b[1] - a[1]).map(e => e[0]);

  // Exclude rooms booked in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRoomIds = bookings
    .filter(b => new Date(b.created_at) >= thirtyDaysAgo)
    .map(b => b.room_type_id);

  const rooms = await model.findSimilarRooms({
    avgPrice,
    maxGuests: commonMaxGuests,
    cities,
    excludeRoomIds: recentRoomIds.length > 0 ? recentRoomIds : undefined,
  });

  // Add Vietnamese reason for each recommendation
  const recommendations = rooms.map(room => {
    const reasons = [];
    const priceDiff = Math.abs(room.price_per_night - avgPrice) / avgPrice;
    if (priceDiff <= 0.3) reasons.push('Cùng khoảng giá với booking trước');
    if (room.city_match) reasons.push('Cùng khu vực bạn hay đặt');
    if (room.max_guests >= commonMaxGuests) reasons.push('Phù hợp số khách thường đặt');
    if (reasons.length === 0) reasons.push('Phòng tương tự với sở thích của bạn');

    return {
      room_id: room.room_id,
      room_name: room.room_name,
      hotel_name: room.hotel_name,
      hotel_address: room.hotel_address,
      price_per_night: room.price_per_night,
      max_guests: room.max_guests,
      amenities: room.amenities,
      reason: reasons.join('. '),
    };
  });

  return { recommendations };
}

/**
 * Ghi log click phòng cho analytics.
 * Sử dụng fire-and-forget pattern: Promise.catch() để log lỗi, không block response.
 * @param {number} roomTypeId - ID loại phòng
 * @param {number} userId - ID người dùng (optional)
 * @returns {Promise<object>} { success: true }
 */
async function trackClick(roomTypeId, userId) {
  log.info('trackClick: tracking', { roomTypeId, userId });
  // Fire-and-forget: never block/fail the response
  model.insertRoomClick(roomTypeId, userId).catch(err => {
    log.error('trackClick: analytics logging failed', { error: err.message });
  });
  return { success: true };
}

/**
 * Lấy thống kê analytics tổng hợp.
 * @param {string} from - Ngày bắt đầu (ISO, optional)
 * @param {string} to - Ngày kết thúc (ISO, optional)
 * @returns {Promise<object>} Thống kê analytics
 */
async function getStats(from, to) {
  log.info('getStats: fetching', { from, to });
  const [topIntents, topAmenities, topRoomsClicked, conversationStats] = await Promise.all([
    model.getTopIntents(from, to),
    model.getTopAmenities(from, to),
    model.getTopRoomsClicked(from, to),
    model.getConversationStats(from, to),
  ]);
  return {
    topIntents,
    topAmenities,
    topRoomsClicked,
    totalConversations: conversationStats.totalConversations,
    totalMessages: conversationStats.totalMessages,
  };
}

/**
 * Kiểm tra trạng thái hoạt động của từng hệ thống con AI.
 * Trả về status tổng thể ("ready"/"degraded"/"error"), subsystems (5 key), active_sessions, timestamp.
 * @returns {Promise<object>} { status, subsystems, active_sessions, timestamp }
 */
async function getStatus() {
  log.info('getStatus: checking');

  // Check database health
  let dbHealthy = false;
  try {
    dbHealthy = await model.checkDbHealth();
  } catch (err) {
    log.error('getStatus: db health check failed', { error: err.message });
  }

  // Check conversation manager
  let conversationOk = true;
  try {
    getActiveSessionCount();
  } catch (err) {
    conversationOk = false;
  }

  // Subsystem statuses — all depend on DB except conversation manager
  const subsystems = {
    chatbot: dbHealthy ? 'ok' : 'error',
    recommendation: dbHealthy ? 'ok' : 'error',
    history_based: dbHealthy ? 'ok' : 'error',
    trending: dbHealthy ? 'ok' : 'error',
    analytics: dbHealthy ? 'ok' : 'error',
  };

  // Override chatbot if conversation manager is down
  if (!conversationOk) {
    subsystems.chatbot = 'error';
  }

  // Overall status
  const allOk = Object.values(subsystems).every(s => s === 'ok');
  const allError = !dbHealthy;
  let status;
  if (allError) {
    status = 'error';
  } else if (allOk) {
    status = 'ready';
  } else {
    status = 'degraded';
  }

  return {
    status,
    subsystems,
    active_sessions: getActiveSessionCount(),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  INTENTS,
  INTENT_KEYWORDS,
  detectIntent,
  AMENITY_DICT,
  CITY_DICT,
  extractPrice,
  extractGuests,
  extractAmenities,
  extractDates,
  extractCity,
  extractSlots,
  // Conversation Manager
  sessions,
  getContext,
  mergeSlots,
  saveMessage,
  getActiveSessionCount,
  cleanupExpiredSessions,
  // Response Builder
  buildResponse,
  formatPrice,
  formatRoomList,
  // Handlers
  chat,
  getRecommendations,
  getTrending,
  getHistoryBased,
  trackClick,
  getStats,
  getStatus,
};
