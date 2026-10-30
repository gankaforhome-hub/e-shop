import 'server-only';

/** Largest accepted JSON body (an order of 100 lines is well under it). */
export const MAX_JSON_BODY_BYTES = 256 * 1024;

export type JsonBodyResult =
  | { ok: true; body: unknown }
  | {
      ok: false;
      status: 400 | 403 | 413 | 415;
      error:
        | 'invalid_json'
        | 'forbidden_origin'
        | 'payload_too_large'
        | 'unsupported_media_type';
    };

/**
 * `true` unless the browser says the request comes from another site. Browsers
 * always send `Origin` on cross-site POSTs; requests without it (curl, server
 * to server) carry no ambient cookies of a visitor, so they are not CSRF.
 */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  // Behind a proxy / dev tunnel the public host arrives as x-forwarded-host
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Reads the untrusted JSON body of a state-changing route handler. Rejects
 * cross-site callers (CSRF), non-JSON content types — which also forces a CORS
 * preflight, so a plain HTML form on another site can't post here — and bodies
 * over `maxBytes`. The caller still validates the result with its Zod schema.
 */
export async function readJsonBody(
  request: Request,
  maxBytes = MAX_JSON_BODY_BYTES,
): Promise<JsonBodyResult> {
  if (!isSameOrigin(request)) {
    return { ok: false, status: 403, error: 'forbidden_origin' };
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return { ok: false, status: 415, error: 'unsupported_media_type' };
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (declaredLength > maxBytes) {
    return { ok: false, status: 413, error: 'payload_too_large' };
  }

  const raw = await request.arrayBuffer();
  if (raw.byteLength > maxBytes) {
    return { ok: false, status: 413, error: 'payload_too_large' };
  }

  try {
    return { ok: true, body: JSON.parse(new TextDecoder().decode(raw)) };
  } catch {
    return { ok: false, status: 400, error: 'invalid_json' };
  }
}
