import { type NextRequest } from 'next/server';

import { finishGoogleSignIn } from '@/features/auth/server';

/** `GET /api/auth/google/callback` — Google redirects here with the authorization code. */
export function GET(request: NextRequest) {
  return finishGoogleSignIn(request);
}
