const { register, login } = require('./auth.service');

const registerHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await register({ email, password });
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await login({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
};
