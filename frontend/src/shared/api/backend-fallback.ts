import 'server-only';

/**
 * Helpers for list reads that degrade instead of failing the page when the
 * backend is down (see AGENTS.md §11 "Backend data"). Used inside the catch of
 * a `'use cache'` DAL function that then returns an empty list with a short
 * `cacheLife`.
 */

/**
 * Rethrows during `next build`: a build without the API must fail loudly
 * instead of prerendering an empty site. At runtime it does nothing.
 */
export function failOnBuild(error: unknown): void {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    throw error;
  }
}

/** One-line server log for a list served empty because the API failed. */
export function logBackendFallback(resource: string, error: unknown): void {
  const reason = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console -- server-side outage trail
  console.error(`[backend] ${resource} unavailable, empty fallback: ${reason}`);
}
