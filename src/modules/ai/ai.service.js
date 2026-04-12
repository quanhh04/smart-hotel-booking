const createLogger = require('../../common/helpers/logger.js');
const model = require('./ai.model.js');
const llm = require('./llm.service.js');

const log = createLogger('ai.service');

// ─── Session Manager (đơn giản) ───────────────────────────────────────────────

const MAX_HISTORY_ENTRIES = 40; // ~10 turns với tool calls

/** @type {Map<string, { geminiContents: Array, messageCount: number }>} */
const sessions = new Map();

function getSession(sessionId) {
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function saveSession(sessionId, geminiContents) {
  if (!sessionId || !geminiContents) return;

  let ctx = sessions.get(sessionId);
  if (!ctx) {
    ctx = { geminiContents: [], messageCount: 0 };
    sessions.set(sessionId, ctx);
  }

  ctx.geminiContents = geminiContents;
  ctx.messageCount++;

  // Giới hạn context size
  while (ctx.geminiContents.length > MAX_HISTORY_ENTRIES) {
    ctx.geminiContents.shift();
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

const UNAVAILABLE_REPLY = 'Xin lỗi, trợ lý AI đang bảo trì. Vui lòng thử lại sau!';

async function chat(message, sessionId, userId) {
  log.info('chat: processing', { sessionId, userId });

  const existing = getSession(sessionId);
  const previousContents = existing ? existing.geminiContents : [];

  const llmResult = await llm.chat(message, previousContents, { userId, model });

  if (llmResult) {
    const { reply, rooms, booking, geminiContents } = llmResult;
    saveSession(sessionId, geminiContents);

    const ctx = getSession(sessionId);
    return {
      intent: 'llm',
      context: {
        session_id: sessionId || null,
        message_count: ctx ? ctx.messageCount : 1,
      },
      reply,
      results: rooms && rooms.length > 0 ? rooms : undefined,
      booking: booking || undefined,
    };
  }

  // LLM không khả dụng
  log.warn('chat: LLM unavailable');
  return {
    intent: 'unavailable',
    context: { session_id: sessionId || null, message_count: 1 },
    reply: UNAVAILABLE_REPLY,
  };
}

// ─── Recommendations ──────────────────────────────────────────────────────────

async function getRecommendations({ guests, max_price, amenities, limit }) {
  log.info('getRecommendations', { guests, max_price, amenities, limit });

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

  let maxBookingCount = 0;
  for (const room of candidates) {
    const count = bookingCounts.get(room.room_id) || 0;
    if (count > maxBookingCount) maxBookingCount = count;
  }
  if (maxBookingCount === 0) maxBookingCount = 1;

  const scored = candidates.map(room => {
    const roomAmenities = (room.amenities || []).map(a => a.toLowerCase());

    // Scoring 5 chiều: price(30%) + guest(15%) + amenity(25%) + popularity(15%) + rating(15%)
    let priceFit = requestedMaxPrice != null && requestedMaxPrice > 0
      ? Math.max(0, Math.min((requestedMaxPrice - room.price_per_night) / requestedMaxPrice, 1)) * 0.30
      : 0.15;

    let guestFit = requestedGuests != null
      ? (room.max_guests < requestedGuests ? 0 : Math.max(0, Math.min(requestedGuests / room.max_guests, 1)) * 0.15)
      : 0.075;

    let amenityMatch = requestedAmenities.length > 0
      ? (requestedAmenities.filter(a => roomAmenities.includes(a)).length / requestedAmenities.length) * 0.25
      : 0.125;

    const popularity = ((bookingCounts.get(room.room_id) || 0) / maxBookingCount) * 0.15;
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
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // Diversify: tối đa 2 phòng/khách sạn
  const hotelCount = {};
  const result = [];
  for (const room of scored) {
    hotelCount[room.hotel_id] = (hotelCount[room.hotel_id] || 0) + 1;
    if (hotelCount[room.hotel_id] <= 2) result.push(room);
    if (result.length >= effectiveLimit) break;
  }

  return result;
}

module.exports = { chat, getRecommendations };
