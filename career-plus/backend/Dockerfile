# Use the official Node.js image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies (including native sqlite3 build tools if needed)
RUN apt-get update && apt-get install -y python3 make g++ \
    && npm install --omit=dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy local code to the container image
COPY . .

# Expose the port (Cloud Run expects apps to listen on port 8080 by default)
EXPOSE 8080

# Run the web service on container startup
CMD [ "npm", "start" ]
