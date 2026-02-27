const chatAdvancedService = require('./chatAdvanced.service');

const chatAdvanced = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: '"message" must be a string.',
      });
    }

    const response = await chatAdvancedService.chatAdvanced(message);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Internal server error.',
    });
  }
};

module.exports = {
  chatAdvanced,
};
