/**
 * Bọc async controller để tự động bắt lỗi và trả response phù hợp.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    const status = error.status || 500;
    const message = status === 500
      ? 'Lỗi hệ thống, vui lòng thử lại sau'
      : error.message;

    if (status >= 500) console.error(error);

    res.status(status).json({ message });
  });
};

module.exports = { asyncHandler };
