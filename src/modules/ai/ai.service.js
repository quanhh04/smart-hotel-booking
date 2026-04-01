const createLogger = require('../../common/helpers/logger.js');
const model = require('./ai.model.js');
const llm = require('./llm.service.js');

const log = createLogger('ai.service');

// ─── Conversation Manager ─────────────────────────────────────────────────────

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 phút
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 phút
const MAX_HISTORY_PAIRS = 10;

/**
 * Session lưu 2 loại history:
 * - geminiContents: Gemini API format (bao gồm tool calls/responses) để gửi lại cho Gemini
 * - messageCount: đếm số cặp tin nhắn
 * @type {Map<string, { geminiContents: Array, messageCount: number, lastActivity: number }>}
 */
const sessions = new Map();

function getContext(sessionId) {
  if (!sessionId) return null;
  const ctx = sessions.get(sessionId);
  if (!ctx) return null;
  ctx.lastActivity = Date.now();
  return ctx;
}

/**
 * Lưu toàn bộ Gemini contents (bao gồm tool calls/responses) vào session.
 * Giới hạn tối đa entries để tránh context quá lớn.
 */
function saveGeminiContents(sessionId, geminiContents) {
  if (!sessionId || !geminiContents) return;

  let ctx = sessions.get(sessionId);
  if (!ctx) {
    ctx = { geminiContents: [], messageCount: 0, lastActivity: Date.now() };
    sessions.set(sessionId, ctx);
  }

  ctx.geminiContents = geminiContents;
  ctx.messageCount++;

  // Giới hạn: giữ tối đa 40 entries (khoảng 10 turns với tool calls)
  const MAX_ENTRIES = MAX_HISTORY_PAIRS * 4;
  while (ctx.geminiContents.length > MAX_ENTRIES) {
    ctx.geminiContents.shift();
  }

  ctx.lastActivity = Date.now();
}

function getActiveSessionCount() {
  return sessions.size;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [id, ctx] of sessions) {
    if (now - ctx.lastActivity > SESSION_TIMEOUT_MS) {
      sessions.delete(id);
    }
  }
}

const _cleanupTimer = setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL_MS);
if (_cleanupTimer.unref) _cleanupTimer.unref();


// ─── Chat Handler (LLM only) ─────────────────────────────────────────────────

const UNAVAILABLE_REPLY = 'Xin lỗi, trợ lý AI đang bảo trì. Vui lòng thử lại sau!';

/**
 * Xử lý tin nhắn chat qua Gemini LLM.
 * Nếu LLM không khả dụng → trả reply tĩnh.
 */
async function chat(message, sessionId, userId) {
  log.info('chat: processing message', { sessionId, userId });

  const existingCtx = getContext(sessionId);
  const previousContents = existingCtx ? existingCtx.geminiContents : [];

  const llmResult = await llm.chat(message, previousContents, { userId, model });

  if (llmResult) {
    const { reply, rooms, booking, geminiContents } = llmResult;

    // Lưu toàn bộ Gemini contents (bao gồm tool calls/responses) vào session
    saveGeminiContents(sessionId, geminiContents);

    // Log analytics (fire-and-forget)
    Promise.resolve().then(async () => {
      try {
        await model.insertIntentLog({ intent: 'llm', message, slots: {}, sessionId, userId });
      } catch (err) {
        log.error('chat: analytics logging failed', { error: err.message });
      }
    });

    const ctx = getContext(sessionId);

    return {
      intent: 'llm',
      context: {
        session_id: sessionId || null,
        message_count: ctx ? ctx.messageCount : 1,
        llm: true,
      },
      reply,
      results: rooms && rooms.length > 0 ? rooms : undefined,
      booking: booking || undefined,
    };
  }

  // LLM unavailable → static reply
  log.warn('chat: LLM unavailable, returning static reply');

  return {
    intent: 'unavailable',
    context: {
      session_id: sessionId || null,
      message_count: 1,
      llm: false,
    },
    reply: UNAVAILABLE_REPLY,
  };
}


// ─── Recommendations ──────────────────────────────────────────────────────────

/**
 * Gợi ý phòng dựa trên sở thích người dùng (scoring 5 chiều).
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

  let maxBookingCount = 0;
  for (const room of candidates) {
    const count = bookingCounts.get(room.room_id) || 0;
    if (count > maxBookingCount) maxBookingCount = count;
  }
  if (maxBookingCount === 0) maxBookingCount = 1;

  const scored = candidates.map(room => {
    const roomAmenities = (room.amenities || []).map(a => a.toLowerCase());

    let priceFit = 0;
    if (requestedMaxPrice != null && requestedMaxPrice > 0) {
      priceFit = Math.max(0, Math.min((requestedMaxPrice - room.price_per_night) / requestedMaxPrice, 1)) * 0.30;
    } else {
      priceFit = 0.15;
    }

    let guestFit = 0;
    if (requestedGuests != null) {
      if (room.max_guests < requestedGuests) {
        guestFit = 0;
      } else {
        guestFit = Math.max(0, Math.min(requestedGuests / room.max_guests, 1)) * 0.15;
      }
    } else {
      guestFit = 0.075;
    }

    let amenityMatch = 0;
    if (requestedAmenities.length > 0) {
      const matched = requestedAmenities.filter(a => roomAmenities.includes(a)).length;
      amenityMatch = (matched / requestedAmenities.length) * 0.25;
    } else {
      amenityMatch = 0.125;
    }

    const roomBookings = bookingCounts.get(room.room_id) || 0;
    const popularity = (roomBookings / maxBookingCount) * 0.15;
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

  scored.sort((a, b) => b.score - a.score);

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


// ─── Trending ─────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách phòng trending/hot theo số booking gần đây.
 */
async function getTrending(days) {
  const effectiveDays = Math.min(Math.max(Number(days) || 7, 7), 30);
  log.info('getTrending: fetching', { days: effectiveDays });

  const [trendingRooms, previousCounts] = await Promise.all([
    model.getTrendingRooms(effectiveDays),
    model.getPreviousPeriodCounts(effectiveDays),
  ]);

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
        percentChange = 100;
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

// ─── History-based Recommendations ────────────────────────────────────────────

/**
 * Gợi ý phòng dựa trên lịch sử booking của user.
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

  const prices = bookings.map(b => Number(b.price_per_night));
  const avgPrice = prices.reduce((s, p) => s + p, 0) / prices.length;

  const guestFreq = {};
  for (const b of bookings) {
    const g = b.max_guests;
    guestFreq[g] = (guestFreq[g] || 0) + 1;
  }
  const commonMaxGuests = Number(Object.entries(guestFreq).sort((a, b) => b[1] - a[1])[0][0]);

  const cityFreq = {};
  for (const b of bookings) {
    const addr = (b.hotel_address || '').toLowerCase();
    if (addr) {
      cityFreq[addr] = (cityFreq[addr] || 0) + 1;
    }
  }
  const cities = Object.entries(cityFreq).sort((a, b) => b[1] - a[1]).map(e => e[0]);

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


// ─── Analytics & Status ───────────────────────────────────────────────────────

async function trackClick(roomTypeId, userId) {
  log.info('trackClick: tracking', { roomTypeId, userId });
  model.insertRoomClick(roomTypeId, userId).catch(err => {
    log.error('trackClick: analytics logging failed', { error: err.message });
  });
  return { success: true };
}

async function getStats(from, to) {
  log.info('getStats: fetching', { from, to });
  const [topIntents, topAmenities, topRoomsClicked, conversationStats] = await Promise.all([
    model.getTopIntents(from, to),
    model.getTopAmenities(from, to),
    model.getTopRoomsClicked(from, to),
    model.getConversationStats(from, to),
  ]);

  const totalClicks = topRoomsClicked.reduce((sum, r) => sum + (r.count || 0), 0);
  const totalAmenityQueries = topAmenities.reduce((sum, a) => sum + (a.count || 0), 0);

  return {
    top_intents: topIntents,
    top_amenities: topAmenities,
    top_rooms: topRoomsClicked,
    total_sessions: conversationStats.totalConversations || 0,
    total_messages: conversationStats.totalMessages || 0,
    total_clicks: totalClicks,
    total_amenity_queries: totalAmenityQueries,
  };
}

async function getStatus() {
  log.info('getStatus: checking');

  let dbHealthy = false;
  try {
    dbHealthy = await model.checkDbHealth();
  } catch (err) {
    log.error('getStatus: db health check failed', { error: err.message });
  }

  let conversationOk = true;
  try {
    getActiveSessionCount();
  } catch (err) {
    conversationOk = false;
  }

  const subsystems = {
    chatbot: dbHealthy ? 'ok' : 'error',
    recommendation: dbHealthy ? 'ok' : 'error',
    history_based: dbHealthy ? 'ok' : 'error',
    trending: dbHealthy ? 'ok' : 'error',
    analytics: dbHealthy ? 'ok' : 'error',
  };

  if (!conversationOk) {
    subsystems.chatbot = 'error';
  }

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
    llm_enabled: llm.isEnabled(),
    active_sessions: getActiveSessionCount(),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  // Conversation Manager
  sessions,
  getContext,
  saveGeminiContents,
  getActiveSessionCount,
  cleanupExpiredSessions,
  // Handlers
  chat,
  getRecommendations,
  getTrending,
  getHistoryBased,
  trackClick,
  getStats,
  getStatus,
};
