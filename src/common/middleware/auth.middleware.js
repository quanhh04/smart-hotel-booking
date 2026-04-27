const jwt = require("jsonwebtoken");

/**
 * authMiddleware — Bắt buộc đăng nhập.
 *
 * Cách hoạt động:
 *   1. Đọc header `Authorization: Bearer <token>`.
 *   2. Verify chữ ký JWT bằng JWT_SECRET (env).
 *   3. Nếu hợp lệ → gắn `req.user = decoded` và gọi next().
 *      decoded là payload đã ký lúc login: { userId, email, role }.
 *   4. Thiếu/không hợp lệ/hết hạn → trả 401, FE thấy 401 sẽ tự logout
 *      (xem httpClient ở FE).
 *
 * Khác với `optional-auth`: middleware này CHẶN request nếu chưa login.
 * Dùng `optional-auth` cho endpoint vừa cho khách vừa cho user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authMiddleware;
