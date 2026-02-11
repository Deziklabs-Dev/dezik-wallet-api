# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Instalar pnpm y dependencias de sistema necesarias
RUN npm install -g pnpm && \
    apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN pnpm install --prod --frozen-lockfile

# Stage 2: Build
FROM node:20-slim AS builder
WORKDIR /app

RUN npm install -g pnpm && \
    apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build
RUN pnpm run build

# Stage 3: Production
FROM node:20-slim AS runner
WORKDIR /app

# Instalar dependencias de ejecución
RUN apt-get update && apt-get install -y openssl dumb-init && \
    rm -rf /var/lib/apt/lists/*

# Crear usuario de sistema
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/sh nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=deps --chown=nestjs:nodejs /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

USER nestjs
EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/src/main.js"]
