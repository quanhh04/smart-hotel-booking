const pool = require('../../config/db');
const roomModel = require('./room.model');
const { createError } = require('../../common/helpers/error');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('room.service');

const listRooms = async ({ minPrice, maxPrice, guests, amenities, checkIn, checkOut, page, limit }) => {
  log.info('listRooms: searching rooms', { minPrice, maxPrice, guests, page, limit });
  const result = await roomModel.getRooms({ minPrice, maxPrice, guests, amenities, checkIn, checkOut, page, limit });
  log.info('listRooms: done', { total: result.total });
  return result;
};

const addRoom = async (roomData) => {
  log.info('addRoom: checking hotel exists', { hotelId: roomData.hotel_id });
  const hotelResult = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [roomData.hotel_id],
  );

  if (hotelResult.rows.length === 0) {
    throw createError('Khách sạn không tồn tại', 404);
  }

  log.info('addRoom: creating room', { hotelId: roomData.hotel_id });
  const room = await roomModel.createRoom(roomData);
  log.info('addRoom: done', { roomId: room.id });
  return room;
};

const updateRoom = async (roomId, data) => {
  log.info('updateRoom: checking room exists', { roomId });
  const room = await roomModel.getRoomById(roomId);
  if (!room) {
    throw createError('Không tìm thấy loại phòng', 404);
  }
  log.info('updateRoom: updating room', { roomId });
  const updated = await roomModel.updateRoom(roomId, data);
  log.info('updateRoom: done', { roomId });
  return updated;
};

const removeRoom = async (roomId) => {
  log.info('removeRoom: checking room exists', { roomId });
  const room = await roomModel.getRoomById(roomId);
  if (!room) {
    throw createError('Không tìm thấy loại phòng', 404);
  }
  log.info('removeRoom: checking active bookings', { roomId });
  const hasActive = await roomModel.hasActiveBookingsForRoom(roomId);
  if (hasActive) {
    throw createError('Không thể xóa loại phòng có booking đang hoạt động', 409);
  }
  log.info('removeRoom: deleting room', { roomId });
  await roomModel.deleteRoom(roomId);
  log.info('removeRoom: done', { roomId });
};

module.exports = { listRooms, addRoom, updateRoom, removeRoom };
