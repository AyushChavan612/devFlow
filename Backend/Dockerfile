# Use an official Node.js image based on Debian (which has 'apt-get')
# We use version 22 to match your local environment
FROM node:22-bookworm-slim

# Set the working directory inside the container
WORKDIR /app

# Install all the compilers and interpreters your app needs
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first
# This caches our node_modules and speeds up future builds
COPY package*.json ./

# Install Node.js dependencies (including express, node-pty, etc.)
RUN npm install

# Copy the rest of your backend code into the container
COPY . .

# Tell Docker your app runs on port 5000
EXPOSE 5000

# The command to run your application
CMD ["node", "index.js"]