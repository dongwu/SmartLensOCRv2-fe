# SmartLensOCR Frontend - Next.js Multi-stage Docker build
# Stage 1: Build Next.js app
# Stage 2: Run Next.js production server

# ============================================================================
# STAGE 1: Builder
# ============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================================================
# STAGE 2: Runtime (Next.js)
# ============================================================================
FROM node:18-alpine

WORKDIR /app

# Install bash for utilities
RUN apk add --no-cache bash

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the Next.js server
CMD ["npm", "start"]
