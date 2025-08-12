const path = require('path');
const express = require('express');
const routes = require('./routes');
const { requestLogger } = require('./middleware/validation');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const fs = require('fs');
const cors = require('cors');
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
  
  // CORS configuration
  const corsOptions = {
    origin: 'https://diochat.petedillo.com',
    optionsSuccessStatus: 200 // For legacy browser support
  };
  app.use(cors(corsOptions));
  logger.info(`🌐 CORS enabled for origin: ${corsOptions.origin}`);
  
  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
  
  // Serve openapi.json for tool discovery
  app.get('/openapi.json', (req, res, next) => {
    const filePath = path.join(__dirname, 'openapi.json');
    logger.info(`Attempting to serve openapi.json from: ${filePath}`);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        logger.error(`File not found at ${filePath}`);
        return next(); // Pass to 404 handler
      }
      res.sendFile(filePath);
    });
  });

  // Mount all API routes under /v2
  app.use('/v2', routes);
  
  // 404 handler for unknown routes
  app.use(notFoundHandler);
  
  // Global error handler (must be last)
  app.use(errorHandler);
  
  logger.info('Express application configured successfully');
  
  return app;
}

module.exports = createApp;
