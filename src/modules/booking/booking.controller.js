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

module.exports = {
  createBooking,
};
