import { createHash, timingSafeEqual } from 'node:crypto';

import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { z } from 'zod';

import { isRevalidatableTag } from '@/shared/config/cache-tags';
import { readJsonBody } from '@/shared/lib/http';

const MAX_BODY_BYTES = 4 * 1024;
const MAX_TAGS = 20;

const bodySchema = z.object({
  tags: z.array(z.string().refine(isRevalidatableTag)).min(1).max(MAX_TAGS),
});

/** Constant-time comparison; hashing first makes both buffers the same length. */
function isSecretValid(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !provided) {
    return false;
  }
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(provided), digest(expected));
}

/**
 * `POST /api/revalidate` — called by the backend after CMS mutations. Header
 * `x-revalidate-secret` must equal `REVALIDATE_SECRET`; body `{ tags: string[] }`
 * (whitelisted tags only). Entries expire immediately, so the next request
 * renders fresh data.
 */
export async function POST(request: Request) {
  if (!isSecretValid(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const result = await readJsonBody(request, MAX_BODY_BYTES);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const parsed = bodySchema.safeParse(result.body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const tags = [...new Set(parsed.data.tags)];
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: tags });
}
