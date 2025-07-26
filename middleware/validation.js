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
 * Validate teleport request
 */
function validateTeleport(req, res, next) {
  const { from, to, coords } = req.body;
  
  if (!from || typeof from !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Player to teleport (from) is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (!to && !coords) {
    return res.status(400).json({
      status: 'error',
      message: 'Must provide either target player (to) or coordinates',
      timestamp: new Date().toISOString()
    });
  }
  
  if (to && coords) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot provide both target player and coordinates',
      timestamp: new Date().toISOString()
    });
  }
  
  if (coords) {
    if (typeof coords.x !== 'number' || typeof coords.y !== 'number' || typeof coords.z !== 'number') {
      return res.status(400).json({
        status: 'error',
        message: 'Coordinates must be numbers (x, y, z)',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  next();
}

/**
 * Validate give item request
 */
function validateGiveItem(req, res, next) {
  const { player, item, amount } = req.body;
  
  if (!player || typeof player !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Player is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (!item || typeof item !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Item is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (amount !== undefined && (!Number.isInteger(amount) || amount < 1 || amount > 64)) {
    return res.status(400).json({
      status: 'error',
      message: 'Amount must be an integer between 1 and 64',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
}

/**
 * Validate player action request (kick, ban)
 */
function validatePlayerAction(req, res, next) {
  const { player, reason } = req.body;
  
  if (!player || typeof player !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Player is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (reason !== undefined && typeof reason !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Reason must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
}

/**
 * Validate gamemode change request
 */
function validateGamemode(req, res, next) {
  const { player, mode } = req.body;
  
  if (!player || typeof player !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Player is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  const validModes = ['survival', 'creative', 'adventure', 'spectator'];
  if (!mode || !validModes.includes(mode)) {
    return res.status(400).json({
      status: 'error',
      message: `Mode must be one of: ${validModes.join(', ')}`,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
}

/**
 * Validate effect application request
 */
function validateEffect(req, res, next) {
  const { player, effect, seconds, amplifier } = req.body;
  
  if (!player || typeof player !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Player is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (!effect || typeof effect !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Effect is required and must be a string',
      timestamp: new Date().toISOString()
    });
  }
  
  if (seconds !== undefined && (!Number.isInteger(seconds) || seconds < 1 || seconds > 1000000)) {
    return res.status(400).json({
      status: 'error',
      message: 'Seconds must be an integer between 1 and 1000000',
      timestamp: new Date().toISOString()
    });
  }
  
  if (amplifier !== undefined && (!Number.isInteger(amplifier) || amplifier < 0 || amplifier > 255)) {
    return res.status(400).json({
      status: 'error',
      message: 'Amplifier must be an integer between 0 and 255',
      timestamp: new Date().toISOString()
    });
  }
  
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
  validateTeleport,
  validateGiveItem,
  validatePlayerAction,
  validateGamemode,
  validateEffect,
  requestLogger
};
