import { startGoogleSignIn } from '@/features/auth/server';

/** `GET /api/auth/google/start?lang=uk|en` — redirects to Google (404 while not configured). */
export function GET(request: Request) {
  return startGoogleSignIn(request);
}
