/**
 * Helper gửi lỗi validation 400.
 * Dùng trong các hàm validate của từng module.
 *
 * Ví dụ:
 *   if (!req.body.email) return sendError(res, 'Email là bắt buộc');
 */
const sendError = (res, message) => {
  return res.status(400).json({ message });
};

module.exports = { sendError };
