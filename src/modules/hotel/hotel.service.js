const hotelModel = require('./hotel.model');

const listHotels = async () => hotelModel.getHotels();

const addHotel = async ({ name, address, description }) =>
  hotelModel.createHotel({ name, address, description });

const getHotelDetail = async (hotelId) => {
  return hotelModel.getHotelDetailById(hotelId);
}

module.exports = {
  listHotels,
  addHotel,
  getHotelDetail,
};
