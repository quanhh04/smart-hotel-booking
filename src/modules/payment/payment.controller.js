const paymentService = require('./payment.service');
const { asyncHandler } = require('../../common/helpers/controller');

const payBooking = asyncHandler(async (req, res) => {
  const { booking_id: bookingId } = req.body;
  const result = await paymentService.createPayment({ bookingId, userId: req.user.userId });
  return res.status(201).json(result);
});

const getPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.getUserPayments(req.user.userId);
  return res.status(200).json(payments);
});

module.exports = { payBooking, getPayments };
