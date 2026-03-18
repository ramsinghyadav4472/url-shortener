# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install --production

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "src/app.js"]
