# Minecraft Server High-Level API Design Plan

## Purpose

To provide a secure, user-friendly REST API for Minecraft Bedrock server management, exposing only safe, high-level endpoints. This avoids the risks of a generic command executor and ensures all user input is validated and mapped to supported Minecraft commands.

## Guiding Principles
- **No raw command execution:** All endpoints correspond to specific, validated server actions.
- **Input validation:** Only allow known-good values (e.g. player names, item IDs, gamemodes).
- **Separation of concerns:** Each endpoint has a clear, single responsibility.
- **Auditable and extensible:** Easy to add new endpoints as needed.

---

## Proposed Endpoints

### 1. List Online Players
- **GET /players**
- **Description:** Returns a list of online players and their IDs.
- **Response Example:**
  ```json
  { "players": [ { "id": "Soniadillo" }, { "id": "ZzThaKINGzZ" } ] }
  ```

### 2. Teleport (tp)
- **POST /tp**
- **Description:** Teleports one player to another player or to coordinates.
- **Request Body:**
  - `from` (string, required): Player to teleport
  - `to` (string, optional): Target player
  - `coords` (object, optional): `{ x: number, y: number, z: number }`
- **Validation:**
  - Must provide either `to` or `coords`, not both
  - Player names must be online
- **Example:**
  ```json
  { "from": "Soniadillo", "to": "PeteDillo3654" }
  ```

### 3. Give Item
- **POST /give**
- **Description:** Gives an item to a player.
- **Request Body:**
  - `player` (string, required): Target player
  - `item` (string, required): Item ID (must match allowed items)
  - `amount` (integer, optional, default 1)
- **Validation:**
  - Item ID must be in `bedrock_inventory_items.json`
  - Player must be online
- **Example:**
  ```json
  { "player": "Soniadillo", "item": "minecraft:diamond_sword", "amount": 1 }
  ```

### 4. Kick Player
- **POST /kick**
- **Description:** Kicks a player from the server.
- **Request Body:**
  - `player` (string, required): Target player
  - `reason` (string, optional)
- **Validation:** Player must be online

### 5. Ban Player
- **POST /ban**
- **Description:** Bans a player from the server.
- **Request Body:**
  - `player` (string, required): Target player
  - `reason` (string, optional)
- **Validation:** Player must be online

### 6. Whitelist Management
- **GET /whitelist**: Get current whitelist
- **POST /whitelist/add**: Add player to whitelist
- **POST /whitelist/remove**: Remove player from whitelist

### 7. Change Gamemode
- **POST /gamemode**
- **Description:** Changes a player's gamemode.
- **Request Body:**
  - `player` (string, required)
  - `mode` (string, required): One of `survival`, `creative`, `adventure`, `spectator`
- **Validation:** Player must be online; mode must be valid

### 8. Apply Effect
- **POST /effect**
- **Description:** Applies a status effect to a player.
- **Request Body:**
  - `player` (string, required)
  - `effect` (string, required): Effect name
  - `seconds` (integer, optional)
  - `amplifier` (integer, optional)
- **Validation:** Player must be online; effect must be valid

---

## Security & Validation
- All input parameters must be validated against known-good values (players, items, gamemodes, effects).
- No arbitrary command execution.
- All endpoints should log requests and responses for auditability.
- Return clear error messages for invalid input.

## Extensibility
- New endpoints can be added by following this structure: define the action, required/optional parameters, validation rules, and example usage.
- Review the Minecraft command guide and inventory items JSON for inspiration and safe actions to expose.

---

## Notes
- This plan is a living document. Update as new needs arise.
- See `minecraft_commands_guide.md` and `bedrock_inventory_items.json` for command and item references.
