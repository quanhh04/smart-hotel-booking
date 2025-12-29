const aiService = require('./ai.service');

const getAiStatus = (req, res) => {
  res.status(200).json(aiService.getStatus());
};

module.exports = {
  getAiStatus,
};
