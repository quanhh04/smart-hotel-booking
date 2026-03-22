const chatAdvancedService = require('./chatAdvanced.service');

const chatAdvanced = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: 'Trường "message" phải là chuỗi ký tự.',
      });
    }

    const response = await chatAdvancedService.chatAdvanced(message);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Lỗi hệ thống, vui lòng thử lại sau.',
    });
  }
};

module.exports = {
  chatAdvanced,
};
