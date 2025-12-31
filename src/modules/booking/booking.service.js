const bookingModel = require('./booking.model');

const createBooking = async ({ userId, roomId, checkIn, checkOut }) =>
  bookingModel.createBooking({
    userId,
    roomId,
    checkIn,
    checkOut,
  });

module.exports = {
  createBooking,
};
