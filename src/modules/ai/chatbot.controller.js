const chatbotService = require('./chatbot.service');

const chat = (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string') {
    return res.status(400).json({
      error: 'Trường "message" phải là chuỗi ký tự.',
    });
  }

  return res.status(200).json(chatbotService.getChatbotReply(message));
};

module.exports = {
  chat,
};
