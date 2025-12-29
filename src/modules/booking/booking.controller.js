const bookingService = require('./booking.service');

const getBookingStatus = (req, res) => {
  res.status(200).json(bookingService.getStatus());
};

module.exports = {
  getBookingStatus,
};
