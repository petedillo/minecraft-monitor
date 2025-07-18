const { exec } = require('child_process');
const logger = require('../utils/logger');

const MINECRAFT_CONTAINER = process.env.MINECRAFT_CONTAINER || 'minecraft-bds-1';

/**
 * Get active players on the server by checking Docker logs
 * @returns {Promise<string[]>} Array of active player names
 */
async function getActivePlayers() {
  return new Promise((resolve, reject) => {
    exec(`docker logs ${MINECRAFT_CONTAINER} --tail 50 | grep "Player connected"`, (error, stdout, stderr) => {
      if (error && error.code !== 1) {
        logger.error(`Error getting player list: ${error.message}`);
        return reject(new Error(`Failed to get active players: ${error.message}`));
      }
      
      if (stdout) {
        const playerMatches = stdout.matchAll(/Player connected:\s+([^,]+)/g);
        const players = [];
        for (const match of playerMatches) {
          if (match[1]) {
            players.push(match[1].trim());
          }
        }
        
        const uniquePlayers = [...new Set(players)];
        logger.info(`Found ${uniquePlayers.length} active players`);
        resolve(uniquePlayers);
      } else {
        resolve([]);
      }
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
 * Get recent chat messages from the server
 * @returns {Promise<string[]>} Array of chat messages
 */
async function getChatMessages() {
  return new Promise((resolve, reject) => {
    exec(`docker logs ${MINECRAFT_CONTAINER} --tail 50 | grep -E "\\[INFO\\].*<.*>"`, (error, stdout, stderr) => {
      if (error && error.code !== 1) {
        logger.error(`Error getting chat messages: ${error.message}`);
        return reject(new Error(`Failed to get chat messages: ${error.message}`));
      }
      
      const messages = stdout ? stdout.trim().split('\n').filter(line => line.trim()) : [];
      logger.info(`Retrieved ${messages.length} chat messages`);
      resolve(messages);
    });
  });
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
      
      // Check for chat messages
      const messages = await getChatMessages();
      if (messages.length > 0) {
        messages.forEach(message => {
          logger.info(`Chat: ${message}`);
        });
      }
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
 * @param {NodeJS.Timer} monitoringInterval - The interval to clear
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
  getChatMessages,
  startServerMonitoring,
  stopServerMonitoring
};
