# Stage 1: Dependencies (production only)
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev) for the build stage
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY prisma ./prisma/
COPY . .

# Generate Prisma Client
RUN bun x prisma generate

# Build the NestJS application (requires @nestjs/cli from devDependencies)
RUN bun run build

# Verify dist was generated
RUN ls -la dist/ && echo "Build OK: dist/main.js exists" || (echo "BUILD FAILED: dist/ is empty" && exit 1)

# Stage 3: Production (install ONLY production deps)
FROM oven/bun:1-alpine AS runner
WORKDIR /app

RUN apk add --no-cache dumb-init openssl

RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -D nestjs

# Copy built dist and production node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Entrypoint: runs prisma migrate deploy then starts app
COPY --chown=nestjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

USER nestjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--", "/app/entrypoint.sh"]
