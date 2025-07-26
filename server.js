require('dotenv').config();

const createApp = require('./app');
const minecraftService = require('./services/minecraftService');
const logger = require('./utils/logger');

// Environment configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Global monitoring interval reference
let monitoringInterval = null;

/**
 * Start the server
 */
function startServer() {
  const app = createApp();
  
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(`📦 Environment: ${NODE_ENV}`);
    logger.info(`🐳 Monitoring container: ${process.env.MINECRAFT_CONTAINER || 'bds'}`);
    
    // Start monitoring server logs
    monitoringInterval = minecraftService.startServerMonitoring();
    logger.info('✅ Server monitoring started');
  });

  // Graceful shutdown handling
  const gracefulShutdown = (signal) => {
    logger.info(`📡 Received ${signal}. Starting graceful shutdown...`);
    
    // Stop monitoring
    if (monitoringInterval) {
      minecraftService.stopServerMonitoring(monitoringInterval);
    }
    
    // Close server
    server.close(() => {
      logger.info('🛑 Server closed successfully');
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle shutdown signals
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  return server;
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
