const bookingService = require('./booking.service');

const createBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { room_type_id: roomTypeId, check_in: checkIn, check_out: checkOut } = req.body;

    const booking = await bookingService.createBooking({
      userId: req.user.userId,
      roomTypeId: Number(roomTypeId),
      checkIn,
      checkOut,
    });

    return res.status(201).json(booking);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const getBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const bookings = await bookingService.getUserBookings(req.user.userId);
    return res.status(200).json(bookings);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const bookingId = Number(req.params.id);

    const booking = await bookingService.cancelBooking({
      bookingId,
      userId: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or cannot be cancelled' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
};
