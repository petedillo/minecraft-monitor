const express = require('express');
const router = express.Router();
const minecraftController = require('../controllers/minecraftController');
const { 
  validateCommand, 
  validateTeleport, 
  validateGiveItem, 
  validatePlayerAction, 
  validateGamemode, 
  validateEffect 
} = require('../middleware/validation');

// Get server status and active players
router.get('/status', minecraftController.getStatus);

// Execute a command on the Minecraft server
router.post('/command', validateCommand, minecraftController.executeCommand);

// High-level API endpoints
// Get list of online players
router.get('/players', minecraftController.getPlayers);

// Teleport a player
router.post('/tp', validateTeleport, minecraftController.teleportPlayer);

// Give an item to a player
router.post('/give', validateGiveItem, minecraftController.giveItem);

// Kick a player
router.post('/kick', validatePlayerAction, minecraftController.kickPlayer);

// Ban a player
router.post('/ban', validatePlayerAction, minecraftController.banPlayer);

// Change a player's gamemode
router.post('/gamemode', validateGamemode, minecraftController.changeGamemode);

// Apply an effect to a player
router.post('/effect', validateEffect, minecraftController.applyEffect);

module.exports = router;
