/**
 * Simple structured logger with colors — no external dependencies.
 * Format: [ISO timestamp] [LEVEL] [module] message | meta
 *
 * Usage:
 *   const log = require('./logger')('auth.service');
 *   log.info('User registered', { email });
 *   log.error('Login failed', error);
 */

// ANSI color codes
const colors = {
  reset:   '\x1b[0m',
  dim:     '\x1b[2m',
  bold:    '\x1b[1m',
  // Levels
  debug:   '\x1b[36m',   // cyan
  info:    '\x1b[32m',   // green
  warn:    '\x1b[33m',   // yellow
  error:   '\x1b[31m',   // red
  // Parts
  ts:      '\x1b[90m',   // gray
  module:  '\x1b[35m',   // magenta
  meta:    '\x1b[90m',   // gray
};

const LEVEL_TAGS = {
  DEBUG: `${colors.debug}DEBUG${colors.reset}`,
  INFO:  `${colors.info}INFO${colors.reset}`,
  WARN:  `${colors.bold}${colors.warn}WARN${colors.reset}`,
  ERROR: `${colors.bold}${colors.error}ERROR${colors.reset}`,
};

const formatMeta = (meta) => {
  if (meta === undefined || meta === null) return '';
  if (meta instanceof Error) return ` ${colors.meta}| ${meta.message}${colors.reset}`;
  if (typeof meta === 'object') {
    try {
      return ` ${colors.meta}| ${JSON.stringify(meta)}${colors.reset}`;
    } catch {
      return ` ${colors.meta}| [unserializable]${colors.reset}`;
    }
  }
  return ` ${colors.meta}| ${meta}${colors.reset}`;
};

const format = (levelTag, mod, message, meta) => {
  const ts = `${colors.ts}${new Date().toISOString()}${colors.reset}`;
  const modStr = `${colors.module}${mod}${colors.reset}`;
  return `${ts} [${levelTag}] [${modStr}] ${message}${formatMeta(meta)}`;
};

const createLogger = (mod) => ({
  debug: (msg, meta) => console.log(format(LEVEL_TAGS.DEBUG, mod, msg, meta)),
  info:  (msg, meta) => console.log(format(LEVEL_TAGS.INFO, mod, msg, meta)),
  warn:  (msg, meta) => console.warn(format(LEVEL_TAGS.WARN, mod, msg, meta)),
  error: (msg, meta) => console.error(format(LEVEL_TAGS.ERROR, mod, msg, meta)),
});

module.exports = createLogger;
