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
 * Get list of online players
 */
async function getPlayers(req, res, next) {
  try {
    const result = await minecraftService.getPlayers();
    
    res.json({
      status: 'success',
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Teleport a player
 */
async function teleportPlayer(req, res, next) {
  try {
    const { from, to, coords } = req.body;
    
    await minecraftService.teleportPlayer(from, to, coords);
    
    res.json({
      status: 'success',
      message: `Teleported ${from} ${to ? `to ${to}` : `to coordinates ${coords.x}, ${coords.y}, ${coords.z}`}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Give an item to a player
 */
async function giveItem(req, res, next) {
  try {
    const { player, item, amount } = req.body;
    
    await minecraftService.giveItem(player, item, amount);
    
    res.json({
      status: 'success',
      message: `Gave ${amount || 1} ${item} to ${player}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Kick a player
 */
async function kickPlayer(req, res, next) {
  try {
    const { player, reason } = req.body;
    
    await minecraftService.kickPlayer(player, reason);
    
    res.json({
      status: 'success',
      message: `Kicked ${player}${reason ? ` for: ${reason}` : ''}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Ban a player
 */
async function banPlayer(req, res, next) {
  try {
    const { player, reason } = req.body;
    
    await minecraftService.banPlayer(player, reason);
    
    res.json({
      status: 'success',
      message: `Banned ${player}${reason ? ` for: ${reason}` : ''}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Change a player's gamemode
 */
async function changeGamemode(req, res, next) {
  try {
    const { player, mode } = req.body;
    
    await minecraftService.changeGamemode(player, mode);
    
    res.json({
      status: 'success',
      message: `Changed ${player}'s gamemode to ${mode}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Apply an effect to a player
 */
async function applyEffect(req, res, next) {
  try {
    const { player, effect, seconds, amplifier } = req.body;
    
    await minecraftService.applyEffect(player, effect, seconds, amplifier);
    
    res.json({
      status: 'success',
      message: `Applied ${effect} to ${player} for ${seconds || 30} seconds`,
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
  getPlayers,
  teleportPlayer,
  giveItem,
  kickPlayer,
  banPlayer,
  changeGamemode,
  applyEffect,
  healthCheck
};
