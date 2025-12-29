const aiModel = require('./ai.model');

const getStatus = () => ({
  module: aiModel.service,
  status: aiModel.status,
});

module.exports = {
  getStatus,
};
