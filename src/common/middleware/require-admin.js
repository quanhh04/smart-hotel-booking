/**
 * Middleware kiểm tra quyền admin.
 * Dùng sau authMiddleware trong route chain.
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
  }
  return next();
};

module.exports = requireAdmin;
