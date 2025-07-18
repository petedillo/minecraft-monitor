const logger = require('../utils/logger');

/**
 * Validate command input for POST /command endpoint
 */
function validateCommand(req, res, next) {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({
      status: 'error',
      message: 'Command is required',
      timestamp: new Date().toISOString()
    });
  }
  
  if (typeof command !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Command must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (command.trim().length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Command cannot be empty',
      timestamp: new Date().toISOString()
    });
  }
  
  // Log the command for security monitoring
  logger.info(`Command validation passed: ${command}`);
  
  next();
}

/**
 * Request logging middleware
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log request
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

module.exports = {
  validateCommand,
  requestLogger
};
