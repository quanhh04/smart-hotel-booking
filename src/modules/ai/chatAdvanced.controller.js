const chatAdvancedService = require('./chatAdvanced.service');
const { asyncHandler } = require('../../common/helpers/controller');

const chatAdvanced = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'Trường "message" phải là chuỗi ký tự.' });
  }

  const response = await chatAdvancedService.chatAdvanced(message);
  return res.status(200).json(response);
});

module.exports = { chatAdvanced };
