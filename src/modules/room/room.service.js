const pool = require('../../config/db');
const roomModel = require('./room.model');
const { createError } = require('../../common/helpers/error');

const listRooms = async ({ minPrice, maxPrice, guests, amenities, checkIn, checkOut }) =>
  roomModel.getRooms({ minPrice, maxPrice, guests, amenities, checkIn, checkOut });

const addRoom = async (roomData) => {
  const hotelResult = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [roomData.hotel_id],
  );

  if (hotelResult.rows.length === 0) {
    throw createError('Khách sạn không tồn tại', 404);
  }

  return roomModel.createRoom(roomData);
};

const getRoomDetail = async (roomId) => roomModel.getRoomById(roomId);

module.exports = { listRooms, addRoom, getRoomDetail };
