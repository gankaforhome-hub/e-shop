import { cookies } from 'next/headers';

import 'server-only';

import { ACCESS_TOKEN_COOKIE } from '@/shared/lib/session/session-cookies';

import { fetchApi, NETWORK_ERROR_STATUS } from './fetch-api';

//INFO Data requests with the signed-in staff member's access token (Server Actions and the DAL).
//INFO Sign-in, refresh and sign-out live in `auth-api.ts`.

export type ApiRequestFailure = {
  ok: false;
  status: number;
  /** The text of the API error (Nest `message`), for logs and unexpected cases, not for the UI. */
  message?: string;
};
export type ApiRequestResult<T> = { ok: true; data: T } | ApiRequestFailure;

type ApiRequestOptions = (
  | { method?: 'GET' | 'DELETE' }
  | { method: 'POST' | 'PATCH'; json?: unknown; formData?: never }
  | { method: 'POST'; formData: FormData; json?: never }
) & {
  /** Extra request headers, e.g. a fresh key signature */
  headers?: Record<string, string>;
};

/** Nest answers errors as `{ message: string | string[] }`. */
function readErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object' || !('message' in body)) {
    return undefined;
  }
  const { message } = body;

  if (typeof message === 'string') {
    return message;
  }
  return Array.isArray(message) ? message.join('; ') : undefined;
}

/**
 * Calls the API as the current staff member. The response shape is owned by the backend:
 * callers state it as `T` and keep the matching types next to the entity
 * (`entities/*\/model`), checked against Swagger by hand.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiRequestResult<T>> {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  const { method = 'GET' } = options;
  const json = 'json' in options ? options.json : undefined;
  const formData = 'formData' in options ? options.formData : undefined;

  const response = await fetchApi(path, {
    method,
    headers: {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(json === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: formData ?? (json === undefined ? undefined : JSON.stringify(json)),
  });

  if (!response) {
    return { ok: false, status: NETWORK_ERROR_STATUS };
  }

  if (!response.ok) {
    const message = readErrorMessage(await response.json().catch(() => null));
    return { ok: false, status: response.status, ...(message && { message }) };
  }

  try {
    return {
      ok: true,
      data: (response.status === 204 ? undefined : await response.json()) as T,
    };
  } catch {
    return { ok: false, status: NETWORK_ERROR_STATUS };
  }
}
