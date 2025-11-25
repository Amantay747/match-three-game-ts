# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Compile TypeScript
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install postgresql-client for pg_isready
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Copy source code for development
COPY src ./src
COPY tsconfig.json ./

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start with entrypoint script
ENTRYPOINT ["./entrypoint.sh"]

