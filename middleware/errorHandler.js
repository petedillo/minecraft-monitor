const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * This should be the last middleware in the stack
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(`Error in ${req.method} ${req.path}:`, err.message);
  logger.error('Stack trace:', err.stack);
  
  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  
  // Handle specific error types
  if (err.message.includes('Failed to get active players')) {
    statusCode = 503;
    message = 'Unable to connect to Minecraft server';
  } else if (err.message.includes('Failed to execute command')) {
    statusCode = 502;
    message = 'Unable to execute command on Minecraft server';
  } else if (err.message.includes('Failed to get chat messages')) {
    statusCode = 503;
    message = 'Unable to retrieve chat messages';
  } else if (err.message.includes('Command must be a non-empty string')) {
    statusCode = 400;
    message = err.message;
  }
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Handle 404 errors for routes that don't exist
 */
function notFoundHandler(req, res) {
  logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
  
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
