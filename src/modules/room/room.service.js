const pool = require('../../config/db');
const roomModel = require('./room.model');
const { createError } = require('../../common/helpers/error');

const listRooms = async (filters) => {
  return roomModel.getRooms(filters);
};

const addRoom = async (roomData) => {
  const hotelResult = await pool.query('SELECT id FROM hotel.hotels WHERE id = $1', [roomData.hotel_id]);
  if (hotelResult.rows.length === 0) throw createError('Khách sạn không tồn tại', 404);
  return roomModel.createRoom(roomData);
};

const updateRoom = async (roomId, data) => {
  const room = await roomModel.getRoomById(roomId);
  if (!room) throw createError('Không tìm thấy loại phòng', 404);
  return roomModel.updateRoom(roomId, data);
};

const removeRoom = async (roomId) => {
  const room = await roomModel.getRoomById(roomId);
  if (!room) throw createError('Không tìm thấy loại phòng', 404);

  const hasActive = await roomModel.hasActiveBookingsForRoom(roomId);
  if (hasActive) throw createError('Không thể xóa loại phòng có booking đang hoạt động', 409);

  await roomModel.deleteRoom(roomId);
};

module.exports = { listRooms, addRoom, updateRoom, removeRoom };
