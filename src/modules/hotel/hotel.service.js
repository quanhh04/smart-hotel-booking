const hotelModel = require('./hotel.model');

const listHotels = async () => hotelModel.listHotels();

const createHotel = async ({ name, address, description }) =>
  hotelModel.createHotel({ name, address, description });

module.exports = {
  listHotels,
  createHotel,
};
