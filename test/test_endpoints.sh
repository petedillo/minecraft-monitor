#!/bin/bash

# Test script for Minecraft Server API endpoints
# Make sure the server is running with 'npm start' before running this script

BASE_URL="http://localhost:3000"
echo "Testing Minecraft Server API endpoints..."
echo "=========================================="

# Test 1: Welcome endpoint
echo "1. Testing welcome endpoint..."
curl -s "$BASE_URL/" | jq '.'
echo -e "\n"

# Test 2: Health check
echo "2. Testing health check..."
curl -s "$BASE_URL/health" | jq '.'
echo -e "\n"

# Test 3: Server status
echo "3. Testing server status..."
curl -s "$BASE_URL/status" | jq '.'
echo -e "\n"

# Test 4: Get players list
echo "4. Testing players list..."
curl -s "$BASE_URL/players" | jq '.'
echo -e "\n"

# Test 5: Give item (valid item)
echo "5. Testing give item (diamond sword)..."
curl -s -X POST "$BASE_URL/give" \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "item": "minecraft:diamond_sword", "amount": 1}' | jq '.'
echo -e "\n"

# Test 6: Give item (invalid item - should fail)
echo "6. Testing give item (invalid item - should fail)..."
curl -s -X POST "$BASE_URL/give" \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "item": "minecraft:invalid_item", "amount": 1}' | jq '.'
echo -e "\n"

# Test 7: Teleport player to coordinates
echo "7. Testing teleport to coordinates..."
curl -s -X POST "$BASE_URL/tp" \
  -H "Content-Type: application/json" \
  -d '{"from": "Soniadillo", "coords": {"x": 100, "y": 64, "z": 100}}' | jq '.'
echo -e "\n"

# Test 8: Teleport player to another player
echo "8. Testing teleport to another player..."
curl -s -X POST "$BASE_URL/tp" \
  -H "Content-Type: application/json" \
  -d '{"from": "Soniadillo", "to": "ZzThaKINGzZ"}' | jq '.'
echo -e "\n"

# Test 9: Change gamemode
echo "9. Testing gamemode change..."
curl -s -X POST "$BASE_URL/gamemode" \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "mode": "creative"}' | jq '.'
echo -e "\n"

# Test 10: Apply effect
echo "10. Testing apply effect..."
curl -s -X POST "$BASE_URL/effect" \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "effect": "speed", "seconds": 60, "amplifier": 1}' | jq '.'
echo -e "\n"

# Test 11: Invalid teleport (missing parameters - should fail)
echo "11. Testing invalid teleport (should fail)..."
curl -s -X POST "$BASE_URL/tp" \
  -H "Content-Type: application/json" \
  -d '{"from": "Soniadillo"}' | jq '.'
echo -e "\n"

# Test 12: Invalid gamemode (should fail)
echo "12. Testing invalid gamemode (should fail)..."
curl -s -X POST "$BASE_URL/gamemode" \
  -H "Content-Type: application/json" \
  -d '{"player": "Soniadillo", "mode": "invalid_mode"}' | jq '.'
echo -e "\n"

# Test 13: Raw command execution (for comparison)
echo "13. Testing raw command execution..."
curl -s -X POST "$BASE_URL/command" \
  -H "Content-Type: application/json" \
  -d '{"command": "say Hello from the API test!"}' | jq '.'
echo -e "\n"

echo "=========================================="
echo "All tests completed!"
echo "Check the server logs for command execution details."

