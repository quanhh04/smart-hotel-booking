/**
 * Tạo error object với HTTP status code.
 * Dùng chung cho service/model khi cần throw lỗi có status.
 *
 * @param {string} message - Thông báo lỗi
 * @param {number} status - HTTP status code (mặc định 400)
 * @returns {Error}
 */
const createError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = { createError };
