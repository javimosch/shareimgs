# Build stage
FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Runtime stage
FROM node:alpine

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set the NODE_PATH environment variable
ENV NODE_PATH=/app/node_modules

# Create a volume at /app
VOLUME /app

CMD ["node", "index.js"]