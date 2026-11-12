# syntax=docker/dockerfile:1
# Backend API (NestJS + Prisma). Build context: the repository root (see compose.yaml).
# Targets: `dev` (nest --watch, files synced by `docker compose watch`) and `prod` (built dist).

FROM node:22-bookworm-slim AS base
# Prisma needs OpenSSL; CA certificates for Supabase, Resend and npm over TLS.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@11.9.0
ENV CI=true
WORKDIR /app
RUN chown node:node /app
USER node

FROM base AS deps
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# `postinstall` runs `prisma generate`, so the schema and config come before the install.
COPY --chown=node:node backend/package.json backend/prisma.config.ts backend/
COPY --chown=node:node backend/prisma backend/prisma
RUN --mount=type=cache,id=pnpm-store,target=/home/node/.pnpm-store,uid=1000,gid=1000 \
  pnpm install --frozen-lockfile --filter backend --store-dir /home/node/.pnpm-store

FROM deps AS dev
COPY --chown=node:node backend backend
EXPOSE 3001
CMD ["pnpm", "--filter", "backend", "dev"]

FROM deps AS prod
COPY --chown=node:node backend backend
RUN pnpm --filter backend build
EXPOSE 3001
# `start:prod` applies pending migrations first, like `pnpm bstart`.
CMD ["pnpm", "--filter", "backend", "start:prod"]
