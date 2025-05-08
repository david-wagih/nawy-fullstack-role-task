# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

###########################
# Build Stage
###########################
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source files (excluding .env, .git, etc. via .dockerignore)
COPY . .

# Build the TypeScript app
RUN npm run build


###########################
# Production Stage
###########################
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 8080

USER appuser

CMD ["sh", "-c", "npx prisma db push && npx prisma generate && node dist/main"]
