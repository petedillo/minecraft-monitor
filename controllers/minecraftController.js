const minecraftService = require('../services/minecraftService');
const logger = require('../utils/logger');

/**
 * Get server status including active players
 */
async function getStatus(req, res, next) {
  try {
    const players = await minecraftService.getActivePlayers();
    
    res.json({
      status: 'running',
      container: process.env.MINECRAFT_CONTAINER || 'tomcraft-bds-1',
      activePlayers: players,
      playerCount: players.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Execute a command on the Minecraft server
 */
async function executeCommand(req, res, next) {
  try {
    const { command } = req.body;
    
    await minecraftService.executeMinecraftCommand(command);
    
    res.json({
      status: 'success',
      message: `Command executed: ${command}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}



/**
 * Health check endpoint
 */
function healthCheck(req, res) {
  res.json({
    status: 'healthy',
    service: 'Minecraft Server Monitor API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}

module.exports = {
  getStatus,
  executeCommand,

  healthCheck
};
