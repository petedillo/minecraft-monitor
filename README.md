# Minecraft Server Monitor API

A secure, high-level Express.js API for monitoring and managing a Minecraft Bedrock server. Provides validated, safe endpoints for common server operations and player management.

**Version:** 2.0.0  
**Author:** Pedro Delgadillo

---

## Features

- Real-time monitoring of Minecraft Bedrock server logs (via Docker)
- Player connection tracking and clean player list endpoint
- Secure, high-level REST API for server administration
- Modular MVC architecture for maintainability
- Comprehensive input validation and error handling
- Centralized logging and audit trail
- Automated and manual API testing

## Environment Variables

| Variable              | Default           | Description                                                      |
|-----------------------|-------------------|------------------------------------------------------------------|
| `PORT`                | `3000`            | Port for the Express API server                                   |
| `NODE_ENV`            | `development`     | Node environment (`development` or `production`)                  |
| `MINECRAFT_CONTAINER` | `bds`             | Docker container name for the Minecraft server (e.g. `bds`, `minecraft-bds-1`) |

All variables can be set in a `.env` file or as environment variables.

## Setup

1. Ensure the Minecraft Bedrock server is running in a Docker container (see [docs/minecraft_commands_guide.md](./docs/minecraft_commands_guide.md) for details)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /` - Welcome message with all endpoints listed
- `GET /health` - Health check
- `GET /status` - Server status, active players, player count
- `GET /players` - List online players (clean format)
- `POST /tp` - Teleport player (to coordinates or another player)
- `POST /give` - Give items to player (validated; see [docs/bedrock_inventory_items.json](./docs/bedrock_inventory_items.json))
- `POST /kick` - Kick player (with optional reason)
- `POST /ban` - Ban player (with optional reason)
- `POST /gamemode` - Change player gamemode (survival, creative, adventure, spectator)
- `POST /effect` - Apply status effects to player

See [`test_examples.md`](./test_examples.md) for detailed usage examples and [`test_endpoints.sh`](./test_endpoints.sh) for automated endpoint tests.

---

## Security, Validation & Audit Logging

- **Input validation:** All endpoints validate input types, required fields, and value ranges
- **Item validation:** `/give` only allows items from [`bedrock_inventory_items.json`](./docs/bedrock_inventory_items.json)
- **No raw command exposure:** Only `/command` endpoint allows raw commands (admin only)
- **Error handling:** Consistent JSON error responses, proper HTTP status codes
- **Logging:** All requests and errors logged for audit trail ([see code in `utils/logger.js`](./utils/logger.js))
- **Auditability:** All actions are logged for traceability

---

## Architecture

- `server.js`: Main entry with graceful shutdown and monitoring
- `app.js`: Express config and middleware setup
- `controllers/`: Request/response handling
- `services/`: Business logic for Minecraft operations
- `middleware/`: Input validation and error handling
- `routes/`: Route definitions
- `utils/logger.js`: Centralized logging
- `docs/`: API design, command reference, and allowed items

---

## Example Usage

See [`test/README.md`](./test/README.md) for all API testing and validation instructions.

## Security & Validation

- **Input validation**: All endpoints validate input types, required fields, and value ranges
- **Item validation**: `/give` only allows items from `bedrock_inventory_items.json`
- **No raw command exposure**: Only `/command` endpoint allows raw commands (admin only)
- **Error handling**: Consistent JSON error responses, proper HTTP status codes
- **Logging**: All requests and errors logged for audit trail

## Architecture

- `server.js`: Main entry with graceful shutdown
- `app.js`: Express config and middleware setup
- `controllers/`: Request/response handling
- `services/`: Business logic for Minecraft operations
- `middleware/`: Input validation and error handling
- `routes/`: Route definitions
- `utils/logger.js`: Centralized logging

## Example Usage

### Get player list
```bash
curl http://localhost:3000/players
```

### Teleport player

#### To coordinates
```bash
curl -X POST http://localhost:3000/tp \
  -H "Content-Type: application/json" \
  -d '{"from": "Soniadillo", "coords": {"x": 100, "y": 64, "z": 100}}'
```

#### To another player
```bash
curl -X POST http://localhost:3000/tp \
  -H "Content-Type: application/json" \
  -d '{"from": "Soniadillo", "to": "ZzThaKINGzZ"}'
```

### Give item
```bash
curl -X POST http://localhost:3000/give \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "item": "minecraft:diamond_block", "amount": 10}'
```

### Change gamemode
```bash
curl -X POST http://localhost:3000/gamemode \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "mode": "creative"}'
```

### Apply effect
```bash
curl -X POST http://localhost:3000/effect \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "effect": "night_vision", "seconds": 300}'
```

### Kick or ban player
```bash
curl -X POST http://localhost:3000/kick \
  -H "Content-Type: application/json" \
  -d '{"player": "TestPlayer", "reason": "Testing kick functionality"}'

curl -X POST http://localhost:3000/ban \
  -H "Content-Type: application/json" \
  -d '{"player": "TestPlayer", "reason": "Testing ban functionality"}'
```

For more tested examples, see [`test_examples.md`](./test_examples.md).
## Configuration

- **Port**: 3000 (set via `PORT` environment variable)
- **Minecraft container name**: `minecraft-bds-1` (set via `MINECRAFT_CONTAINER` env)

## Testing

All test scripts, manual examples, and validation instructions have been moved to [test/README.md](./test/README.md).

---

This API provides a secure, high-level abstraction over Minecraft server commands for safe, auditable server management.

See [test/README.md](./test/README.md) for detailed usage examples and testing instructions.
