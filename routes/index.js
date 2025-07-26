const express = require('express');
const router = express.Router();
const minecraftController = require('../controllers/minecraftController');
const minecraftRoutes = require('./minecraft');

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Minecraft Server Monitor API!',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      status: '/status',
      command: '/command (POST)',
      players: '/players',
      teleport: '/tp (POST)',
      give: '/give (POST)',
      kick: '/kick (POST)',
      ban: '/ban (POST)',
      gamemode: '/gamemode (POST)',
      effect: '/effect (POST)'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get('/health', minecraftController.healthCheck);

// Mount minecraft routes
router.use('/', minecraftRoutes);

module.exports = router;
