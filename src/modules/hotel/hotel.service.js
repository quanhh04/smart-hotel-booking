const hotelModel = require('./hotel.model');

const listHotels = async () => hotelModel.getHotels();

const addHotel = async ({ name, address, description }) =>
  hotelModel.createHotel({ name, address, description });

module.exports = {
  listHotels,
  addHotel,
};
