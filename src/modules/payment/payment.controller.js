/**
 * payment.controller — Thanh toán đơn đặt phòng.
 *
 * Endpoints (mount tại /payments):
 *   POST   /payments              → payBooking        — Thanh toán 1 đơn (PENDING → PAID)
 *   GET    /payments              → getPayments       — Lịch sử payment của user
 *   POST   /payments/refund       → refund            — Admin: hoàn tiền theo booking_id
 *   GET    /payments/admin/all    → getAllPayments    — Admin: list tất cả payment
 *   GET    /payments/:id          → getPaymentDetail  — Admin: chi tiết payment
 *
 * Lưu ý: dự án này KHÔNG tích hợp gateway thật — chỉ ghi nhận PAID/REFUNDED.
 */
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

const refund = asyncHandler(async (req, res) => {
  const { booking_id: bookingId } = req.body;
  const result = await paymentService.refundPayment(bookingId);
  return res.status(200).json(result);
});

const getAllPayments = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await paymentService.getAllPayments({ status, page, limit });
  return res.status(200).json(result);
});

const getPaymentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payment = await paymentService.getPaymentDetail(parseInt(id));
  return res.status(200).json(payment);
});

module.exports = { payBooking, getPayments, refund, getAllPayments, getPaymentDetail };
