# syntax=docker/dockerfile:1
# Storefront (Next.js). Build context: the repository root (see compose.yaml).
# Targets: `dev` (next dev, files synced by `docker compose watch`) and `prod`.
# `next build` needs a live API (failOnBuild, generateStaticParams), which isn't reachable
# while an image builds, so the prod container builds on start, once the backend is healthy.

FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm@11.9.0
ENV CI=true NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN chown node:node /app
USER node

FROM base AS deps
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node frontend/package.json frontend/
RUN --mount=type=cache,id=pnpm-store,target=/home/node/.pnpm-store,uid=1000,gid=1000 \
  pnpm install --frozen-lockfile --filter frontend --store-dir /home/node/.pnpm-store

FROM deps AS dev
COPY --chown=node:node frontend frontend
EXPOSE 3000
CMD ["pnpm", "--filter", "frontend", "dev"]

FROM deps AS prod
COPY --chown=node:node frontend frontend
EXPOSE 3000
CMD ["sh", "-c", "pnpm --filter frontend build && pnpm --filter frontend start"]
