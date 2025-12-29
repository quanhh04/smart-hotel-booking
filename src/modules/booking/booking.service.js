const bookingModel = require('./booking.model');

const getStatus = () => ({
  module: bookingModel.service,
  status: bookingModel.status,
});

module.exports = {
  getStatus,
};
