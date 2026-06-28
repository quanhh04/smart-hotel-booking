const sendError = (res, message) => {
  return res.status(400).json({ message });
};

module.exports = { sendError };
