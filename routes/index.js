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
      health: '/v2/health',
      status: '/v2/api/status',
      command: '/v2/api/command (POST)',
      players: '/v2/api/players',
      teleport: '/v2/api/tp (POST)',
      give: '/v2/api/give (POST)',
      kick: '/v2/api/kick (POST)',
      ban: '/v2/api/ban (POST)',
      gamemode: '/v2/api/gamemode (POST)',
      effect: '/v2/api/effect (POST)',
      say: '/v2/api/say (POST)'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get('/health', minecraftController.healthCheck);

// Mount minecraft routes
router.use('/api', minecraftRoutes);

module.exports = router;
