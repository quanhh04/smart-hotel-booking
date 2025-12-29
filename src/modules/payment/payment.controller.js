const paymentService = require('./payment.service');

const getPaymentStatus = (req, res) => {
  res.status(200).json(paymentService.getStatus());
};

module.exports = {
  getPaymentStatus,
};
