FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# Create a volume at /app
VOLUME /app

# Copy the package.json file
COPY package*.json ./

# Install dependencies
RUN npm install