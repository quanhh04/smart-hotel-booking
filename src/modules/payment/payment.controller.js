const paymentService = require('./payment.service');

const payBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { booking_id: bookingId, amount } = req.body;

    if (!Number.isInteger(bookingId) || !Number.isFinite(amount)) {
      return res
        .status(400)
        .json({ message: 'booking_id and amount are required as numbers' });
    }

    const result = await paymentService.createPayment({
      bookingId,
      amount,
    });

    return res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    return res.status(status).json({ message });
  }
};

module.exports = {
  payBooking,
};
