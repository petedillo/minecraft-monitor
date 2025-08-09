const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const MINECRAFT_CONTAINER = process.env.MINECRAFT_CONTAINER || 'bds';

// Load allowed items from JSON file
let allowedItems = {};
try {
  const itemsPath = path.join(__dirname, '../docs/bedrock_inventory_items.json');
  allowedItems = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
} catch (error) {
  logger.error('Failed to load bedrock inventory items:', error.message);
}

/**
 * Get active players on the server by checking Docker logs
 * @returns {Promise<string[]>} Array of active player names
 */
async function getActivePlayers() {
  return new Promise((resolve, reject) => {
    // 1. Fetch raw logs without relying on grep to avoid timing/buffering issues.
    // We fetch a larger number of lines to accurately determine who is currently online.
    exec(`docker logs ${MINECRAFT_CONTAINER} --tail 200`, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error getting docker logs: ${error.message}`);
        return reject(new Error(`Failed to get docker logs: ${error.message}`));
      }

      // 2. Process the logs in JavaScript to determine the current player list.
      const playerState = {}; // Use an object to track the latest status of each player.

      const lines = stdout.split('\n');
      for (const line of lines) {
        const connectedMatch = line.match(/Player connected: ([^,]+),/);
        if (connectedMatch && connectedMatch[1]) {
          const player = connectedMatch[1].trim();
          playerState[player] = 'connected'; // Mark player as connected.
        }

        const disconnectedMatch = line.match(/Player disconnected: ([^,]+),/);
        if (disconnectedMatch && disconnectedMatch[1]) {
          const player = disconnectedMatch[1].trim();
          playerState[player] = 'disconnected'; // Mark player as disconnected.
        }
      }

      // 3. Filter down to only the players who are currently connected.
      const activePlayers = Object.keys(playerState).filter(
        (player) => playerState[player] === 'connected'
      );

      logger.info(`Found ${activePlayers.length} active players: ${activePlayers.join(', ')}`);
      resolve(activePlayers);
    });
  });
}

/**
 * Execute a command in the Minecraft server
 * @param {string} command - The command to execute
 * @returns {Promise<string>} Command output
 */
async function executeMinecraftCommand(command) {
  if (!command || typeof command !== 'string') {
    throw new Error('Command must be a non-empty string');
  }

  return new Promise((resolve, reject) => {
    exec(`docker exec ${MINECRAFT_CONTAINER} send-command "${command}"`, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error executing command "${command}": ${error.message}`);
        return reject(new Error(`Failed to execute command: ${error.message}`));
      }
      logger.info(`Successfully executed command: ${command}`);
      resolve(stdout);
    });
  });
}

/**
 * Get players in the format required by the API
 * @returns {Promise<Object>} Object with players array
 */
async function getPlayers() {
  const playerNames = await getActivePlayers();
  const players = playerNames.map(name => ({ id: name }));
  return { players };
}

/**
 * Teleport a player to another player or coordinates
 * @param {string} from - Player to teleport
 * @param {string} to - Target player (optional)
 * @param {Object} coords - Coordinates {x, y, z} (optional)
 * @returns {Promise<string>} Command output
 */
async function teleportPlayer(from, to, coords) {
  let command;
  if (to) {
    command = `tp ${from} ${to}`;
  } else if (coords) {
    command = `tp ${from} ${coords.x} ${coords.y} ${coords.z}`;
  } else {
    throw new Error('Must provide either target player or coordinates');
  }
  
  return await executeMinecraftCommand(command);
}

/**
 * Give an item to a player
 * @param {string} player - Target player
 * @param {string} item - Item ID
 * @param {number} amount - Amount to give
 * @returns {Promise<string>} Command output
 */
async function giveItem(player, item, amount = 1) {
  // Validate item exists in allowed items
  const isValidItem = Object.values(allowedItems).some(category => 
    Array.isArray(category) && category.includes(item)
  );
  
  if (!isValidItem) {
    throw new Error(`Item '${item}' is not allowed`);
  }
  
  const command = `give ${player} ${item} ${amount}`;
  return await executeMinecraftCommand(command);
}

/**
 * Kick a player from the server
 * @param {string} player - Player to kick
 * @param {string} reason - Kick reason (optional)
 * @returns {Promise<string>} Command output
 */
async function kickPlayer(player, reason) {
  const command = reason ? `kick ${player} ${reason}` : `kick ${player}`;
  return await executeMinecraftCommand(command);
}

/**
 * Ban a player from the server
 * @param {string} player - Player to ban
 * @param {string} reason - Ban reason (optional)
 * @returns {Promise<string>} Command output
 */
async function banPlayer(player, reason) {
  const command = reason ? `ban ${player} ${reason}` : `ban ${player}`;
  return await executeMinecraftCommand(command);
}

/**
 * Change a player's gamemode
 * @param {string} player - Target player
 * @param {string} mode - Gamemode (survival, creative, adventure, spectator)
 * @returns {Promise<string>} Command output
 */
async function changeGamemode(player, mode) {
  const validModes = ['survival', 'creative', 'adventure', 'spectator'];
  if (!validModes.includes(mode)) {
    throw new Error(`Invalid gamemode '${mode}'. Must be one of: ${validModes.join(', ')}`);
  }
  
  const command = `gamemode ${mode} ${player}`;
  return await executeMinecraftCommand(command);
}

/**
 * Apply an effect to a player
 * @param {string} player - Target player
 * @param {string} effect - Effect name
 * @param {number} seconds - Duration in seconds
 * @param {number} amplifier - Effect amplifier
 * @returns {Promise<string>} Command output
 */
async function applyEffect(player, effect, seconds = 30, amplifier = 0) {
  const command = `effect ${player} ${effect} ${seconds} ${amplifier}`;
  return await executeMinecraftCommand(command);
}

/**
 * Monitor server logs for specific patterns
 * @returns {NodeJS.Timer} Interval timer for monitoring
 */
function startServerMonitoring() {
  logger.info('Starting server monitoring...');
  
  const checkLogs = async () => {
    try {
      const players = await getActivePlayers();
      logger.info(`Currently monitoring ${players.length} players`);
      

    } catch (error) {
      logger.error('Error monitoring logs:', error);
    }
  };
  
  // Check logs every 10 seconds
  const monitoringInterval = setInterval(checkLogs, 10000);
  checkLogs(); // Initial check
  
  return monitoringInterval;
}

/**
 * Stop server monitoring
 * @param {NodeJS.Timeout} monitoringInterval - The interval to clear
 */
function stopServerMonitoring(monitoringInterval) {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    logger.info('Server monitoring stopped');
  }
}

module.exports = {
  getActivePlayers,
  executeMinecraftCommand,
  getPlayers,
  teleportPlayer,
  giveItem,
  kickPlayer,
  banPlayer,
  changeGamemode,
  applyEffect,
  startServerMonitoring,
  stopServerMonitoring
};
