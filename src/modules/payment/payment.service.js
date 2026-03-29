const paymentModel = require('./payment.model');
const notificationService = require('../notification/notification.service');
const { createError } = require('../../common/helpers/error');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('payment.service');

const createPayment = async ({ bookingId, userId }) => {
  log.info('createPayment: processing payment', { bookingId, userId });
  const payment = await paymentModel.processPayment({ bookingId, userId });
  log.info('createPayment: notifying', { bookingId, paymentId: payment.payment.id });
  notificationService.notifyPaymentSuccess(payment);
  log.info('createPayment: done', { bookingId, paymentId: payment.payment.id });
  return payment;
};

const getUserPayments = async (userId) => {
  log.info('getUserPayments: fetching', { userId });
  const payments = await paymentModel.getPaymentsByUserId(userId);
  log.info('getUserPayments: done', { userId, count: payments.length });
  return payments;
};

const refundPayment = async (bookingId) => {
  log.info('refundPayment: processing refund', { bookingId });
  const result = await paymentModel.processRefund(bookingId);
  log.info('refundPayment: done', { bookingId, paymentId: result.payment.id });
  return result;
};

const getAllPayments = async ({ status, page, limit }) => {
  log.info('getAllPayments: fetching', { status, page, limit });
  const result = await paymentModel.getAllPayments({ status, page, limit });
  log.info('getAllPayments: done', { total: result.total });
  return result;
};

const getPaymentDetail = async (paymentId) => {
  log.info('getPaymentDetail: fetching', { paymentId });
  const payment = await paymentModel.getPaymentById(paymentId);
  if (!payment) {
    throw createError('Không tìm thấy giao dịch thanh toán', 404);
  }
  log.info('getPaymentDetail: done', { paymentId });
  return payment;
};

module.exports = { createPayment, getUserPayments, refundPayment, getAllPayments, getPaymentDetail };
