# Testing the Minecraft Server Monitor API

**For general API setup, environment variables, and endpoint documentation, see the main [README](../README.md).**

This directory contains all test scripts, example requests, and instructions for validating the API.

## Test Contents

- `test_endpoints.sh` — Automated shell script to test all major API endpoints. Run after starting the API server.
- `test_examples.md` — Manual curl examples and validation/error-handling demonstrations.

## How to Run Tests

### Automated Tests

1. Ensure the API server is running (`npm start` in the project root).
2. Run the shell script:
   ```bash
   ./test_endpoints.sh
   ```
3. Review output and server logs for results.

### Manual Examples

See `test_examples.md` for a variety of tested curl commands and expected responses. These are useful for troubleshooting, custom requests, and learning the API.

---

For more API details, features, and environment setup, see the [main README](../README.md).
