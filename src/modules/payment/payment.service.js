const paymentModel = require('./payment.model');
const { createError } = require('../../common/helpers/error');

const createPayment = async ({ bookingId, amount }) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError('Số tiền phải là số dương');
  }

  return paymentModel.processMockPayment({ bookingId, amount });
};

const getUserPayments = async (userId) =>
  paymentModel.getPaymentsByUserId(userId);

module.exports = {
  createPayment,
  getUserPayments,
};
