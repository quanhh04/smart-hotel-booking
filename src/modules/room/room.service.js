const roomModel = require('./room.model');

const listRooms = async ({ minPrice, maxPrice, guests, amenities }) =>
  roomModel.getRooms({ minPrice, maxPrice, guests, amenities });

const addRoom = async ({
  hotel_id,
  name,
  price_per_night,
  max_guests,
  description,
  amenities,
}) =>
  roomModel.createRoom({
    hotel_id,
    name,
    price_per_night,
    max_guests,
    description,
    amenities,
  });

const getRoomDetail = async (roomId) => roomModel.getRoomById(roomId);

module.exports = {
  listRooms,
  addRoom,
  getRoomDetail,
};
