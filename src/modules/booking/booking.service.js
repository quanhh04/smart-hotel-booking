const bookingModel = require('./booking.model');
const notificationService = require('../notification/notification.service');
const { createError } = require('../../common/helpers/error');

const createBooking = async ({ userId, roomTypeId, checkIn, checkOut, paymentMethod }) => {
  if (new Date(checkOut) <= new Date(checkIn)) {
    throw createError('Ngày trả phòng phải sau ngày nhận phòng', 400);
  }

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

const getBookingDetail = async (bookingId, userId) => {
  const booking = await bookingModel.getBookingById(bookingId);
  if (!booking) {
    throw createError('Không tìm thấy đặt phòng', 404);
  }
  if (booking.user_id !== userId) {
    throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  }
  return booking;
};

const getAllBookings = async ({ status, page, limit }) => {
  return bookingModel.getAllBookings({ status, page, limit });
};

module.exports = { createBooking, getUserBookings, cancelBooking, getBookingDetail, getAllBookings };
