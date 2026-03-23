const paymentModel = require('./payment.model');
const notificationService = require('../notification/notification.service');

const createPayment = async ({ bookingId, userId }) => {
  const payment = await paymentModel.processPayment({ bookingId, userId });

  notificationService.notifyPaymentSuccess(payment);

  return payment;
};

const getUserPayments = async (userId) =>
  paymentModel.getPaymentsByUserId(userId);

module.exports = { createPayment, getUserPayments };
