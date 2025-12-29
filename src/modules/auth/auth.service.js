const authModel = require('./auth.model');

const getStatus = () => ({
  module: authModel.service,
  status: authModel.status,
});

module.exports = {
  getStatus,
};
