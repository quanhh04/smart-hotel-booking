const paymentModel = require('./payment.model');

const createPayment = async ({ bookingId, amount }) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    const error = new Error('Số tiền phải là số dương');
    error.status = 400;
    throw error;
  }

  return paymentModel.processMockPayment({
    bookingId,
    amount,
  });
};

const getUserPayments = async (userId) =>
  paymentModel.getPaymentsByUserId(userId);

module.exports = {
  createPayment,
  getUserPayments,
};
