/**
 * Search-engine indexing switch (temporary, pre-launch). Indexing stays off
 * unless `ALLOW_INDEXING=true` is set for the deployment, so local, preview
 * and production builds are all safe by default. Read at build time by
 * `next.config.ts` (`X-Robots-Tag` header) and `app/robots.ts` — redeploy
 * after changing it.
 *
 * Kept dependency-free: `next.config.ts` imports it directly.
 */
export const isIndexingAllowed = process.env.ALLOW_INDEXING === 'true';
