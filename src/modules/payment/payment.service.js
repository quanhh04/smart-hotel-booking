const paymentModel = require('./payment.model');
const notificationService = require('../notification/notification.service');
const { createError } = require('../../common/helpers/error');

const createPayment = async ({ bookingId, userId }) => {
  const payment = await paymentModel.processPayment({ bookingId, userId });

  notificationService.notifyPaymentSuccess(payment);

  return payment;
};

const getUserPayments = async (userId) =>
  paymentModel.getPaymentsByUserId(userId);

const refundPayment = async (bookingId) => {
  return paymentModel.processRefund(bookingId);
};

const getAllPayments = async ({ status, page, limit }) => {
  return paymentModel.getAllPayments({ status, page, limit });
};

const getPaymentDetail = async (paymentId) => {
  const payment = await paymentModel.getPaymentById(paymentId);
  if (!payment) {
    throw createError('Không tìm thấy giao dịch thanh toán', 404);
  }
  return payment;
};

module.exports = { createPayment, getUserPayments, refundPayment, getAllPayments, getPaymentDetail };
