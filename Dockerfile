# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install all dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build the application (skip linting for minimal build)
RUN bun build src/index.ts --outdir=dist --target=bun

# Production stage with Bun Alpine (minimal and fast)
FROM oven/bun:1-alpine AS production

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup -g 1001 -S bungroup && adduser -S bunuser -u 1001 -G bungroup

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder --chown=bunuser:bungroup /app/dist ./dist
COPY --from=builder --chown=bunuser:bungroup /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=bunuser:bungroup /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=bunuser:bungroup /app/package.json ./package.json
COPY --from=builder --chown=bunuser:bungroup /app/bun.lock ./
COPY --from=builder --chown=bunuser:bungroup /app/prisma ./prisma

# Install production dependencies (includes Prisma CLI)
RUN bun install --production

# Switch to non-root user
USER bunuser

ENV NODE_ENV=production
# Expose port
EXPOSE 8080

# Start the application with Bun (faster than Node.js)
CMD ["bun", "run", "dist/index.js"]
