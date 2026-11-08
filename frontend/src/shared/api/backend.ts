import 'server-only';

const REQUEST_TIMEOUT_MS = 8000;

export type BackendResult =
  { ok: true; data: unknown } | { ok: false; status: number };

interface BackendGetOptions {
  searchParams?: Record<string, string | undefined>;
}

function getApiUrl(): string {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not set (see frontend/.env.example)');
  }

  return apiUrl.replace(/\/+$/, '');
}

/**
 * GET request to the backend API. Returns the untyped JSON body: the calling
 * slice parses it once with its own guard (`model/api-types.ts`), so no
 * casts leak into consumers. Network errors and timeouts reject; HTTP errors
 * resolve as `{ ok: false, status }` (e.g. 404 → `null` in the DAL).
 */
export async function backendGet(
  path: string,
  { searchParams }: BackendGetOptions = {},
): Promise<BackendResult> {
  const url = new URL(`${getApiUrl()}/${path.replace(/^\/+/, '')}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  const data: unknown = await response.json();

  return { ok: true, data };
}
