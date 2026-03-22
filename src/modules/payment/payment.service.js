const paymentModel = require('./payment.model');

const createPayment = async ({ bookingId, userId }) => {
  return paymentModel.processPayment({ bookingId, userId });
};

const getUserPayments = async (userId) =>
  paymentModel.getPaymentsByUserId(userId);

module.exports = { createPayment, getUserPayments };
