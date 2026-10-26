import { NextResponse } from 'next/server';

import { createLead } from '@/features/contact-us/server';

/** `POST /api/leads` — accepts a `LeadPayload`, responds `201 { ok: true }`. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  //INFO імітація помилки
  // return NextResponse.json(
  // {
  //   error: 'internal_server_error',
  //   issues: [],
  // },
  // { status: 500 },
  // );

  const result = await createLead(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: result.issues },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
