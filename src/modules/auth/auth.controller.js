const authService = require('./auth.service');
const { asyncHandler } = require('../../common/helpers/controller');

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.register(email, password);
  return res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  return res.status(200).json(token);
});

const me = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };
