# --- Stage 1: The Builder ---
# This stage builds your production app
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the production app
RUN npm run build

# --- Stage 2: The Runner ---
# This stage creates the final, small image
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Copy only the necessary files from the 'builder' stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# The command to run the production server
CMD ["node", "server.js"]