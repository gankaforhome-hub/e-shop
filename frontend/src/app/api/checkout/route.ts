import { NextResponse } from 'next/server';

import { createOrder } from '@/features/checkout/server';

/** `POST /api/checkout` — accepts an `OrderPayload`, responds `201 { orderId }`. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const result = await createOrder(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: result.issues },
      { status: result.status },
    );
  }

  return NextResponse.json({ orderId: result.orderId }, { status: 201 });
}
