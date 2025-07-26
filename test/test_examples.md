# API Test Examples

## Successful Tests (from test_endpoints.sh)

All endpoints are working correctly! Here are some additional examples you can test:

### Kick Player (use with caution)
```bash
curl -X POST http://localhost:3000/kick \
  -H "Content-Type: application/json" \
  -d '{"player": "TestPlayer", "reason": "Testing kick functionality"}'
```

### Ban Player (use with caution)
```bash
curl -X POST http://localhost:3000/ban \
  -H "Content-Type: application/json" \
  -d '{"player": "TestPlayer", "reason": "Testing ban functionality"}'
```

### Give Different Items
```bash
# Give food
curl -X POST http://localhost:3000/give \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "item": "minecraft:golden_apple", "amount": 5}'

# Give tools
curl -X POST http://localhost:3000/give \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "item": "minecraft:diamond_pickaxe", "amount": 1}'

# Give blocks
curl -X POST http://localhost:3000/give \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "item": "minecraft:diamond_block", "amount": 10}'
```

### Different Gamemodes
```bash
# Survival mode
curl -X POST http://localhost:3000/gamemode \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "mode": "survival"}'

# Adventure mode
curl -X POST http://localhost:3000/gamemode \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "mode": "adventure"}'

# Spectator mode
curl -X POST http://localhost:3000/gamemode \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "mode": "spectator"}'
```

### Different Effects
```bash
# Night vision
curl -X POST http://localhost:3000/effect \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "effect": "night_vision", "seconds": 300}'

# Jump boost
curl -X POST http://localhost:3000/effect \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "effect": "jump_boost", "seconds": 120, "amplifier": 2}'

# Regeneration
curl -X POST http://localhost:3000/effect \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "effect": "regeneration", "seconds": 60, "amplifier": 1}'
```

## Test Results Summary

	**All endpoints working correctly:**
- `/` - Welcome message with all endpoints listed
- `/health` - Health check
- `/status` - Server status with player list
- `/players` - Clean player list format
- `/give` - Item giving with validation
- `/tp` - Teleportation (both coordinates and player-to-player)
- `/gamemode` - Gamemode changes with validation
- `/effect` - Effect application
- `/command` - Raw command execution (legacy)

	**Validation working:**
- Invalid items rejected
- Invalid gamemodes rejected
- Missing required parameters rejected
- Invalid coordinate formats rejected

	**Error handling working:**
- Proper error messages
- Appropriate HTTP status codes
- Consistent JSON response format

The API is now fully functional with secure, high-level endpoints!

