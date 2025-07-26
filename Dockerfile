# Dockerfile for Minecraft Express API
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the source code
COPY . .

# Expose port (default Express port)
EXPOSE 3000

# Start the API
CMD ["node", "server.js"]
