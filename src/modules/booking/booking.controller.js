/**
 * booking.controller — Đặt phòng và quản lý đơn đặt phòng.
 *
 * Endpoints (mount tại /bookings):
 *   POST   /bookings              → createBooking     — Tạo đơn (cần login)
 *   GET    /bookings              → getBookings       — Danh sách đơn của user hiện tại
 *   GET    /bookings/:id          → getBookingDetail  — Chi tiết 1 đơn (chỉ chủ đơn)
 *   PATCH  /bookings/:id/cancel   → cancelBooking     — Huỷ đơn PENDING/CONFIRMED
 *   GET    /bookings/admin/all    → getAllBookings    — Admin: list tất cả đơn
 *
 * Đặc thù: createBooking dùng transaction + FOR UPDATE để tránh
 * 2 user đặt cùng phòng cùng ngày → xem booking.model.js.
 */
const bookingService = require('./booking.service');
const { asyncHandler } = require('../../common/helpers/controller');

const createBooking = asyncHandler(async (req, res) => {
  const {
    room_type_id: roomTypeId,
    check_in: checkIn,
    check_out: checkOut,
    payment_method: paymentMethod,
  } = req.body;

  const booking = await bookingService.createBooking({
    userId: req.user.userId,
    roomTypeId: Number(roomTypeId),
    checkIn,
    checkOut,
    paymentMethod: paymentMethod || 'online',
  });

  return res.status(201).json(booking);
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user.userId);
  return res.status(200).json(bookings);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const bookingId = Number(req.params.id);

  const booking = await bookingService.cancelBooking({
    bookingId,
    userId: req.user.userId,
  });

  if (!booking) {
    return res.status(404).json({ message: 'Không tìm thấy đặt phòng hoặc không thể hủy' });
  }

  return res.status(200).json(booking);
});

const getBookingDetail = asyncHandler(async (req, res) => {
  const bookingId = Number(req.params.id);
  const booking = await bookingService.getBookingDetail(bookingId, req.user.userId);
  return res.status(200).json(booking);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const result = await bookingService.getAllBookings({
    status,
    page: Number(page),
    limit: Number(limit),
  });
  return res.status(200).json({ ...result, page: Number(page), limit: Number(limit) });
});

module.exports = { createBooking, getBookings, cancelBooking, getBookingDetail, getAllBookings };
