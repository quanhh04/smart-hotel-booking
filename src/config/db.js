/**
 * config/db.js — Kết nối Postgres dùng chung cho toàn app.
 *
 * - `Pool` (thay vì `Client`) để tái sử dụng connection cho nhiều request.
 *   Mỗi `pool.query(...)` sẽ tự lấy 1 connection rỗi → chạy → trả lại pool.
 *
 * - `ssl: { rejectUnauthorized: false }`: cho phép kết nối SSL với certificate
 *   tự ký (thường gặp ở Neon, Supabase, Render). KHÔNG nên dùng false ở môi
 *   trường on-prem nếu bạn quản lý CA — khi đó hãy đặt CA cụ thể.
 *
 * - Khi module load: ping DB bằng `SELECT 1` để fail-fast nếu sai
 *   DATABASE_URL → tránh server lên xanh nhưng mọi request đều 500.
 */
const { Pool } = require('pg');
const createLogger = require('../common/helpers/logger');
const log = createLogger('db');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await pool.query('SELECT 1');
    log.info('Connected to PostgreSQL');
  } catch (err) {
    log.error('PostgreSQL connection failed', err);
    process.exit(1);
  }
})();

module.exports = pool;
