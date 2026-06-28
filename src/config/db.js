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
