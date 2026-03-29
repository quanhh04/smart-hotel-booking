const createLogger = require('./logger');
const log = createLogger('http');

/**
 * Bọc async controller handler với error handling + logging tự động.
 * Log: START → END (hoặc ERROR) cho mọi request.
 *
 * @param {Function} fn - Async controller function (req, res) => {}
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  const requestId = req.headers['x-request-id'] || '-';

  log.info(`START ${method} ${originalUrl}`, { requestId });

  Promise.resolve(fn(req, res, next))
    .then(() => {
      const duration = Date.now() - start;
      log.info(`END ${method} ${originalUrl} ${res.statusCode} ${duration}ms`, { requestId });
    })
    .catch((error) => {
      const duration = Date.now() - start;
      const status = error.status || 500;
      const message = status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : error.message;

      if (status >= 500) {
        log.error(`ERROR ${method} ${originalUrl} ${status} ${duration}ms`, error);
      } else {
        log.warn(`FAIL ${method} ${originalUrl} ${status} ${duration}ms`, { message, requestId });
      }

      return res.status(status).json({ message });
    });
};

module.exports = { asyncHandler };
