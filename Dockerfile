# Use our new custom base image from your registry
FROM petedillo.com/node-docker:latest

# The base image already sets the user and working directory.

# Copy package files and install dependencies
# Note: The base image switches to a non-root user, so we need to ensure
# file permissions are correct. Using COPY --chown is good practice.
COPY --chown=appuser:appuser package*.json ./
RUN npm install --production

# Copy the rest of your application's source code
COPY --chown=appuser:appuser . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "server.js"]