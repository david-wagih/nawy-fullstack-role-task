# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

# --- Build Stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (only package.json and lock file for cache efficiency)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application source (excluding files via .dockerignore)
COPY --link . .

# Build the Next.js app
RUN npm run build


# --- Production Stage ---
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --ingroup appuser appuser

# Copy only necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/components.json ./
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/store ./store
COPY --from=builder /app/types ./types

# Ensure .next/cache/images exists and is owned by appuser
RUN mkdir -p /app/.next/cache/images && \
    chown -R 1001:1001 /app/.next

USER appuser

EXPOSE 3000
CMD ["npm", "start"]
