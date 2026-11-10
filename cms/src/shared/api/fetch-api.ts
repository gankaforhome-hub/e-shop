import { getApiUrl, getCmsOrigin } from '@/shared/config/env';

//INFO Server side only. Also runs in `proxy.ts`, so there is no `server-only` import here.
//INFO The one place that talks to the API over HTTP: the CMS origin header the API checks on
//INFO cookie routes, no caching, and a network failure reported as `null`.

export const NETWORK_ERROR_STATUS = 503;

export type FetchApiInit = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: BodyInit;
};

/** `null` when the API can't be reached. Callers set `Content-Type` themselves (FormData sets its own). */
export async function fetchApi(
  path: string,
  { method, headers, body }: FetchApiInit,
): Promise<Response | null> {
  try {
    return await fetch(`${getApiUrl()}${path}`, {
      method,
      cache: 'no-store',
      headers: { Origin: getCmsOrigin(), ...headers },
      body,
    });
  } catch {
    return null;
  }
}
