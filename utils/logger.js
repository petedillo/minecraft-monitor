/**
 * Simple logger utility with timestamp and log levels
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {...any} args - Additional arguments
 */
function formatLog(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (args.length > 0) {
    console.log(formattedMessage, ...args);
  } else {
    console.log(formattedMessage);
  }
}

const logger = {
  error: (message, ...args) => formatLog(LOG_LEVELS.ERROR, message, ...args),
  warn: (message, ...args) => formatLog(LOG_LEVELS.WARN, message, ...args),
  info: (message, ...args) => formatLog(LOG_LEVELS.INFO, message, ...args),
  debug: (message, ...args) => formatLog(LOG_LEVELS.DEBUG, message, ...args)
};

module.exports = logger;
