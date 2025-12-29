const paymentModel = require('./payment.model');

const getStatus = () => ({
  module: paymentModel.service,
  status: paymentModel.status,
});

module.exports = {
  getStatus,
};
