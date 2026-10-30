import { NextResponse } from 'next/server';

import { createLead } from '@/features/contact-us/server';
import { readJsonBody } from '@/shared/lib/http';

/** `POST /api/leads` — accepts a `LeadPayload`, responds `201 { ok: true }`. */
export async function POST(request: Request) {
  const read = await readJsonBody(request);
  if (!read.ok) {
    return NextResponse.json({ error: read.error }, { status: read.status });
  }

  const result = await createLead(read.body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: result.issues },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
