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

module.exports = { createBooking, getBookings, cancelBooking };
