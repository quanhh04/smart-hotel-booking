const hotelService = require('./hotel.service');

const getHotelStatus = (req, res) => {
  res.status(200).json(hotelService.getStatus());
};

module.exports = {
  getHotelStatus,
};
