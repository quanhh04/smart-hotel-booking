const bookingModel = require('./booking.model');
const notificationService = require('../notification/notification.service');

const createBooking = async ({ userId, roomTypeId, checkIn, checkOut, paymentMethod }) => {
  const booking = await bookingModel.createBooking({ userId, roomTypeId, checkIn, checkOut, paymentMethod });
  notificationService.notifyBookingCreated(booking);
  return booking;
};

const getUserBookings = async (userId) =>
  bookingModel.getBookingsByUserId(userId);

const cancelBooking = async ({ bookingId, userId }) => {
  const booking = await bookingModel.cancelBooking({ bookingId, userId });
  notificationService.notifyBookingCancelled(booking);
  return booking;
};

module.exports = { createBooking, getUserBookings, cancelBooking };
