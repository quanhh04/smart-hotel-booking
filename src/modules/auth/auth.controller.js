const authService = require('./auth.service');

const getAuthStatus = (req, res) => {
  res.status(200).json(authService.getStatus());
};

module.exports = {
  getAuthStatus,
};
