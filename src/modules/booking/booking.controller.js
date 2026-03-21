const bookingService = require('./booking.service');

const isValidDate = (value) => {
  if (!value) {
    return false;
  }
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp);
};

const createBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
console.log('Received booking request:', req.user, 'with body:', req.body);
    const { room_id: roomId, check_in: checkIn, check_out: checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res
        .status(400)
        .json({ message: 'room_id, check_in, and check_out are required' });
    }

    const parsedCheckIn = isValidDate(checkIn);
    const parsedCheckOut = isValidDate(checkOut);

    if (!parsedCheckIn || !parsedCheckOut) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (parsedCheckIn >= parsedCheckOut) {
      return res
        .status(400)
        .json({ message: 'check_out must be after check_in' });
    }

    const booking = await bookingService.createBooking({
      userId: req.user.userId,
      roomId: Number(roomId),
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
    if (!Number.isFinite(bookingId)) {
      return res.status(400).json({ message: 'Booking id is invalid' });
    }

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
