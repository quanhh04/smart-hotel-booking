const jwt = require('jsonwebtoken');

/**
 * Optional auth middleware.
 * Decode JWT nếu có, inject req.user. Không block nếu không có token.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    // Token invalid/expired — ignore, treat as unauthenticated
  }

  return next();
};

module.exports = optionalAuth;
