const express = require('express');
const router = express.Router();
const minecraftController = require('../controllers/minecraftController');
const minecraftRoutes = require('./minecraft');

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Minecraft Server Monitor API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      status: '/status',
      command: '/command (POST)',
      chat: '/chat'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get('/health', minecraftController.healthCheck);

// Mount minecraft routes
router.use('/', minecraftRoutes);

module.exports = router;
