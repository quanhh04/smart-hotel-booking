const paymentModel = require('./payment.model');

const createPayment = async ({ bookingId, amount }) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    const error = new Error('amount must be a positive number');
    error.status = 400;
    throw error;
  }

  return paymentModel.processMockPayment({
    bookingId,
    amount,
  });
};

module.exports = {
  createPayment,
};
