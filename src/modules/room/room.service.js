const pool = require('../../config/db');
const roomModel = require('./room.model');

const listRooms = async ({ minPrice, maxPrice, guests, amenities, checkIn, checkOut }) =>
  roomModel.getRooms({ minPrice, maxPrice, guests, amenities, checkIn, checkOut });

const addRoom = async ({
  hotel_id,
  name,
  price_per_night,
  max_guests,
  description,
  amenities,
  total_quantity,
}) => {
  if (!total_quantity || total_quantity < 1) {
    const error = new Error('total_quantity phải lớn hơn hoặc bằng 1');
    error.status = 400;
    throw error;
  }

  const hotelResult = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [hotel_id],
  );
  if (hotelResult.rows.length === 0) {
    const error = new Error('Khách sạn không tồn tại');
    error.status = 404;
    throw error;
  }

  return roomModel.createRoom({
    hotel_id,
    name,
    price_per_night,
    max_guests,
    description,
    amenities,
    total_quantity,
  });
};

const getRoomDetail = async (roomId) => roomModel.getRoomById(roomId);

module.exports = {
  listRooms,
  addRoom,
  getRoomDetail,
};
