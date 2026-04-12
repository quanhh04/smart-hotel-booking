/**
 * Logger đơn giản — không dependency.
 *
 * Cách dùng:
 *   const log = require('./logger')('auth.service');
 *   log.info('User registered', { email });
 *   log.error('Login failed', error);
 *
 * Output: [2025-01-15T10:30:00.000Z] [INFO] [auth.service] User registered | {"email":"..."}
 */

function formatMeta(meta) {
  if (meta == null) return '';
  if (meta instanceof Error) return ` | ${meta.message}`;
  if (typeof meta === 'object') {
    try { return ` | ${JSON.stringify(meta)}`; }
    catch { return ' | [unserializable]'; }
  }
  return ` | ${meta}`;
}

function createLogger(moduleName) {
  function write(level, msg, meta) {
    const line = `[${new Date().toISOString()}] [${level}] [${moduleName}] ${msg}${formatMeta(meta)}`;
    if (level === 'ERROR') console.error(line);
    else if (level === 'WARN') console.warn(line);
    else console.log(line);
  }

  return {
    debug: (msg, meta) => write('DEBUG', msg, meta),
    info:  (msg, meta) => write('INFO', msg, meta),
    warn:  (msg, meta) => write('WARN', msg, meta),
    error: (msg, meta) => write('ERROR', msg, meta),
  };
}

module.exports = createLogger;
