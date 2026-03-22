/**
 * Bọc async controller handler với error handling tự động.
 * Loại bỏ try/catch lặp lại trong mọi controller.
 *
 * @param {Function} fn - Async controller function (req, res) => {}
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    const status = error.status || 500;
    const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;
    return res.status(status).json({ message });
  });
};

module.exports = { asyncHandler };
