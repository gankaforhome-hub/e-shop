# syntax=docker/dockerfile:1
# CMS (Next.js). Build context: the repository root (see compose.yaml).
# Targets: `dev` (next dev, files synced by `docker compose watch`) and `prod` (next build at
# image build time: the CMS build doesn't call the API).

FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm@11.9.0
ENV CI=true NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN chown node:node /app
USER node

FROM base AS deps
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node cms/package.json cms/
RUN --mount=type=cache,id=pnpm-store,target=/home/node/.pnpm-store,uid=1000,gid=1000 \
  pnpm install --frozen-lockfile --filter cms --store-dir /home/node/.pnpm-store

FROM deps AS dev
COPY --chown=node:node cms cms
EXPOSE 3030
CMD ["pnpm", "--filter", "cms", "dev"]

FROM deps AS prod
COPY --chown=node:node cms cms
# Placeholders that only satisfy the config at build time (as in CI); real values come
# from cms/.env and compose at runtime.
RUN API_URL=http://backend:3001/api CMS_URL=http://localhost:3030 pnpm --filter cms build
EXPOSE 3030
# Port set here: the `start` script still uses 3001 (AGENTS.md §17).
CMD ["pnpm", "--filter", "cms", "exec", "next", "start", "--port", "3030"]
