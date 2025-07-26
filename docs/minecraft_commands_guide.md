# Minecraft Bedrock Server Commands Guide

This guide provides a comprehensive list of commands you can use with your Minecraft Bedrock server running in Docker.

## How to Use Commands

To send a command to your Minecraft server, use:

```bash
docker exec minecraft-bds-1 send-command "your_command_here"
```

For example, to say "Hello world!" to all players:

```bash
docker exec minecraft-bds-1 send-command "say Hello world!"
```

## General Commands

### Communication Commands
- `say <message>` - Broadcasts a message to all players
- `tell <player> <message>` - Sends a private message to a specific player
- `me <action>` - Displays an action message from the server
- `title <player> title|subtitle|actionbar <text>` - Displays title/subtitle/actionbar text to player(s)
  - Example: `title @a title Welcome!`

### Player Management
- `list` - Lists all online players (shows in server console)
- `testfor @a` - Tests for all players (can be used to get player list)
- `kick <player> [reason]` - Kicks a player from the server
- `ban <player> [reason]` - Bans a player from the server
- `ban-ip <ip> [reason]` - Bans an IP address from the server
- `pardon <player>` - Unbans a player
- `pardon-ip <ip>` - Unbans an IP address
- `op <player>` - Grants operator status to a player
- `deop <player>` - Removes operator status from a player
- `whitelist add <player>` - Adds a player to the whitelist
- `whitelist remove <player>` - Removes a player from the whitelist
- `whitelist list` - Lists all players on the whitelist
- `whitelist on|off` - Enables/disables the whitelist

### Game Control
- `difficulty <peaceful|easy|normal|hard>` - Sets the game difficulty
- `gamerule showcoordinates true` - Enables showing coordinates on-screen for all players
- `gamerule showtags true` - Enables showing player tags including days played
- `tag @s add show_coords` - Adds a tag to show coordinates (if using a custom system)
- `tag @s remove show_coords` - Removes the coordinates tag
- `scoreboard objectives add PlayTime dummy "Days Played"` - Creates a scoreboard to track play time
- `scoreboard players add @a PlayTime 1` - Increments play time (can be automated with a command block)
- `gamemode <survival|creative|adventure|spectator> [player]` - Changes game mode for a player
- `gamerule <rule> [value]` - Sets or queries a game rule value
  - Example: `gamerule keepInventory true`
  - Example: `gamerule showcoordinates true` - Shows player coordinates on screen
  - Example: `gamerule showTags true` - Shows days played and other tags
- `time set <time>` - Sets the in-game time (day, night, noon, midnight, or ticks)
- `weather <clear|rain|thunder> [duration]` - Changes the weather
- `setworldspawn [x y z]` - Sets the world spawn point
- `spawnpoint [player] [x y z]` - Sets a player's spawn point
- `tp <player> <x> <y> <z>` - Teleports a player to specific coordinates
- `tp <player> <target>` - Teleports a player to another player
  
### Server Management
- `save-all` - Saves the server state to disk
- `save-off` - Disables automatic server saving
- `save-on` - Enables automatic server saving
- `stop` - Stops the server
- `reload` - Reloads server configurations

### Item and Block Commands
- `give <player> <item> [amount] [data] [components]` - Gives items to a player
- `clear <player> [item] [data] [maxCount]` - Clears items from player inventory
- `setblock <x> <y> <z> <block> [data]` - Places a block at the specified coordinates
- `fill <x1> <y1> <z1> <x2> <y2> <z2> <block> [data]` - Fills a region with blocks

### Effect Commands
- `effect <player> <effect> [seconds] [amplifier] [hideParticles]` - Applies a status effect
- `effect <player> clear` - Removes all effects from a player

### Experience Commands
- `xp add <player> <amount> [level|points]` - Adds experience to a player
- `xp set <player> <amount> [level|points]` - Sets a player's experience

### Scoreboard Commands
- `scoreboard objectives add <name> <criterion> [display name]` - Adds a new objective
- `scoreboard objectives remove <name>` - Removes an objective
- `scoreboard objectives list` - Lists all objectives
- `scoreboard players add|set|remove <player> <objective> <score>` - Modifies player scores

## Docker-Specific Commands

### Container Management
- `docker ps` - List running containers
- `docker logs minecraft-bds-1` - View server logs
- `docker restart minecraft-bds-1` - Restart the Minecraft server
- `docker stop minecraft-bds-1` - Stop the Minecraft server
- `docker start minecraft-bds-1` - Start the Minecraft server

### Server Configuration
- `docker exec minecraft-bds-1 set-property <property> <value>` - Set a server property

## Advanced Usage

### Scheduled Commands
You can set up cron jobs to run commands at specific times:

```bash
# Example: Send a message every hour
0 * * * * docker exec minecraft-bds-1 send-command "say Server has been running for another hour!"
```

### Backup Commands
To backup your Minecraft world:

```bash
# Create a backup directory if it doesn't exist
mkdir -p /root/services/minecraft/backups

# Create a timestamped backup
tar -czf /root/services/minecraft/backups/world_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /root/services/minecraft/data worlds
```

## Troubleshooting

If commands aren't working:
1. Make sure the server is running: `docker ps | grep minecraft`
2. Check server logs for errors: `docker logs minecraft-bds-1`
3. Verify the container name is correct (it might be different if you've renamed it)
4. Make sure you're using the correct syntax for Bedrock Edition commands


This section provides a comprehensive guide to all items you can give to players using the `/give` command in Minecraft Java Edition. Use the format:

```
/give <player> <item_id> [amount]
```

- `<player>`: The target player (e.g., @p, @a, player name)
- `<item_id>`: The item identifier (see below)
- `[amount]`: (Optional) Number of items to give

## Example
```
/give @p minecraft:diamond_sword 1
```

## Inventory Items

The full list of inventory items and their categories is now stored in `bedrock_inventory_items.json` in this directory for easier programmatic access and maintenance.

If you need to update or view the list, please check the JSON file directly.

For a full, always-updated list, visit the [Minecraft Wiki Items Page](https://minecraft.fandom.com/wiki/Java_Edition_data_values/Items). For more advanced usage, you can add NBT data for custom names, enchantments, and more.

## References
- [Official Minecraft Bedrock Commands Documentation](https://minecraft.fandom.com/wiki/Commands#List_of_commands)

*This guide is current as of July 2025. Always check the wiki for the latest updates.*
