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

module.exports = {
  listRooms,
  addRoom,
};
