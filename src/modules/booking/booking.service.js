const bookingModel = require('./booking.model');
const notificationService = require('../notification/notification.service');
const { createError } = require('../../common/helpers/error');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('booking.service');

const createBooking = async ({ userId, roomTypeId, checkIn, checkOut, paymentMethod }) => {
  log.info('createBooking: validating dates', { userId, roomTypeId, checkIn, checkOut });
  if (new Date(checkOut) <= new Date(checkIn)) {
    throw createError('Ngày trả phòng phải sau ngày nhận phòng', 400);
  }

  log.info('createBooking: creating booking', { userId, roomTypeId, paymentMethod });
  const booking = await bookingModel.createBooking({ userId, roomTypeId, checkIn, checkOut, paymentMethod });
  log.info('createBooking: notifying', { bookingId: booking.id });
  notificationService.notifyBookingCreated(booking);
  log.info('createBooking: done', { bookingId: booking.id });
  return booking;
};

const getUserBookings = async (userId) => {
  log.info('getUserBookings: fetching', { userId });
  const bookings = await bookingModel.getBookingsByUserId(userId);
  log.info('getUserBookings: done', { userId, count: bookings.length });
  return bookings;
};

const cancelBooking = async ({ bookingId, userId }) => {
  log.info('cancelBooking: cancelling', { bookingId, userId });
  const booking = await bookingModel.cancelBooking({ bookingId, userId });
  log.info('cancelBooking: notifying', { bookingId });
  notificationService.notifyBookingCancelled(booking);
  log.info('cancelBooking: done', { bookingId });
  return booking;
};

const getBookingDetail = async (bookingId, userId) => {
  log.info('getBookingDetail: fetching', { bookingId, userId });
  const booking = await bookingModel.getBookingById(bookingId);
  if (!booking) {
    throw createError('Không tìm thấy đặt phòng', 404);
  }
  if (booking.user_id !== userId) {
    throw createError('Bạn không có quyền thực hiện thao tác này', 403);
  }
  log.info('getBookingDetail: done', { bookingId });
  return booking;
};

const getAllBookings = async ({ status, page, limit }) => {
  log.info('getAllBookings: fetching', { status, page, limit });
  const result = await bookingModel.getAllBookings({ status, page, limit });
  log.info('getAllBookings: done', { total: result.total });
  return result;
};

module.exports = { createBooking, getUserBookings, cancelBooking, getBookingDetail, getAllBookings };
