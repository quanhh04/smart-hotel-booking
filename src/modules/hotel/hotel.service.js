const hotelModel = require('./hotel.model');

const getStatus = () => ({
  module: hotelModel.service,
  status: hotelModel.status,
});

module.exports = {
  getStatus,
};
