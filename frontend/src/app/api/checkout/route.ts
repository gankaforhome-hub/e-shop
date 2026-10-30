import { NextResponse } from 'next/server';

import { createOrder } from '@/features/checkout/server';
import { readJsonBody } from '@/shared/lib/http';

/** `POST /api/checkout` — accepts an `OrderPayload`, responds `201 { orderId }`. */
export async function POST(request: Request) {
  const read = await readJsonBody(request);
  if (!read.ok) {
    return NextResponse.json({ error: read.error }, { status: read.status });
  }

  const result = await createOrder(read.body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: result.issues },
      { status: result.status },
    );
  }

  return NextResponse.json({ orderId: result.orderId }, { status: 201 });
}
