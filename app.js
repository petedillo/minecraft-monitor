const express = require('express');
const routes = require('./routes');
const { requestLogger } = require('./middleware/validation');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

/**
 * Create and configure Express application
 * @returns {express.Application} Configured Express app
 */
function createApp() {
  const app = express();
  
  // Trust proxy for accurate IP addresses
  app.set('trust proxy', 1);
  
  // Request logging middleware
  app.use(requestLogger);
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // CORS headers for development mode
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      next();
    });
    logger.info('🌐 CORS enabled for development mode');
  }
  
  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  // Mount routes
  app.use('/', routes);
  
  // 404 handler for unknown routes
  app.use(notFoundHandler);
  
  // Global error handler (must be last)
  app.use(errorHandler);
  
  logger.info('Express application configured successfully');
  
  return app;
}

module.exports = createApp;
