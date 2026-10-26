import 'server-only';

import { leadPayloadSchema } from '../model/lead-payload.schema';

export type CreateLeadResult =
  | { ok: true }
  | {
      ok: false;
      status: 400 | 502;
      error: 'invalid_payload' | 'upstream_failed';
      issues?: { path: string; message: string }[];
    };

/**
 * Validates an untrusted lead payload, logs it and forwards it to
 * `LEAD_API_URL` when configured. Pure input → result; the route handler only
 * maps the result to HTTP.
 */
export async function createLead(input: unknown): Promise<CreateLeadResult> {
  const parsed = leadPayloadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: 'invalid_payload',
      issues: parsed.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }

  const payload = parsed.data;

  // eslint-disable-next-line no-console -- lead trail until persistence lands
  console.info('[leads] lead received', JSON.stringify(payload, null, 2));

  const endpoint = process.env.LEAD_API_URL;
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Lead API responded with ${response.status}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console -- server-side error trail
      console.error('[leads] failed to forward lead:', error);
      return { ok: false, status: 502, error: 'upstream_failed' };
    }
  }

  return { ok: true };
}
