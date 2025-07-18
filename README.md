# Minecraft Server Monitor API

A simplified Express.js application that monitors Minecraft Bedrock server logs and provides basic server management capabilities.

## Features

- Real-time monitoring of Docker logs from the Minecraft Bedrock server container
- Player connection tracking
- Command execution API
- Simple REST API for server status

## Setup

1. Make sure the Minecraft server is running in a Docker container
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

## API Endpoints

- `GET /`: Welcome message
- `GET /status`: Returns server status, active players, and player count
- `POST /command`: Execute a command on the server (requires JSON body with `command` field)

## Configuration

The application uses the following configuration:
- Port: 3000 (can be changed via the PORT environment variable)
- Minecraft container name: `tomcraft-bds-1` (can be changed via the MINECRAFT_CONTAINER environment variable)

## How It Works

The application monitors Docker logs from the Minecraft server container to:
1. Track player connections and disconnections
3. Provide API endpoints for server management
4. Execute commands on the server via Docker exec

## Example Usage

### Check server status
```bash
curl http://localhost:3000/status
```

### Execute a server command
```bash
curl -X POST http://localhost:3000/command \
  -H "Content-Type: application/json" \
  -d '{"command": "say Hello from the API!"}'
```
### tp command
```bash
curl -X POST http://localhost:3000/command \
  -H "Content-Type: application/json" \
  -d '{"command": "tp @a ~ ~ ~"}'
```
