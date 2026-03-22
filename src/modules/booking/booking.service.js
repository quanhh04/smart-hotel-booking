const bookingModel = require('./booking.model');

const createBooking = async ({ userId, roomTypeId, checkIn, checkOut, paymentMethod }) =>
  bookingModel.createBooking({ userId, roomTypeId, checkIn, checkOut, paymentMethod });

const getUserBookings = async (userId) =>
  bookingModel.getBookingsByUserId(userId);

const cancelBooking = async ({ bookingId, userId }) =>
  bookingModel.cancelBooking({ bookingId, userId });

module.exports = { createBooking, getUserBookings, cancelBooking };
