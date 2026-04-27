/**
 * server.js — Entry point thực sự của ứng dụng.
 *
 * Vai trò:
 *   1. Nạp biến môi trường từ .env (dotenv).
 *   2. Khởi tạo kết nối Postgres (require './config/db' → tự ping DB).
 *   3. Import `app` đã được lắp ráp sẵn từ app.js.
 *   4. Lắng nghe cổng PORT (mặc định 3000).
 *
 * Tách khỏi app.js để khi viết test không cần khởi động listen().
 */
require('dotenv').config();

require('./config/db');

const app = require('./app');
const createLogger = require('./common/helpers/logger');
const log = createLogger('server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log.info(`Server listening on port ${PORT}`);
});
