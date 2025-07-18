const express = require('express');
const router = express.Router();
const minecraftController = require('../controllers/minecraftController');
const { validateCommand } = require('../middleware/validation');

// Get server status and active players
router.get('/status', minecraftController.getStatus);

// Execute a command on the Minecraft server
router.post('/command', validateCommand, minecraftController.executeCommand);



module.exports = router;
