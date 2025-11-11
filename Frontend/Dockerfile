# --- Stage 1: The Builder ---
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- THIS IS THE FIX (Part 1) ---
# This line tells Docker to expect a build-time variable
ARG NEXT_PUBLIC_BACKEND_URL
# This line makes it available to the 'npm run build' command
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN npm run build

# --- Stage 2: The Runner ---
FROM node:22-bookworm-slim AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]