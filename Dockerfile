# Step 1: Build React Frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production Full-Stack Express + SQLite Server
FROM node:20-alpine
WORKDIR /app

# Install build dependencies for sqlite3 native binaries
RUN apk add --no-cache python3 make g++ sqlite

COPY package*.json ./
RUN npm install --only=production

# Copy compiled dist bundle and backend server
COPY --from=build /app/dist ./dist
COPY server ./server

# Create data directory for SQLite database file
RUN mkdir -p /app/data

EXPOSE 8080
ENV PORT=8080
ENV DATA_DIR=/app/data
ENV NODE_ENV=production

CMD ["node", "server/server.js"]
