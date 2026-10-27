import { type NextRequest, NextResponse } from 'next/server';

import { getFavoriteItems } from '@/features/add-to-favorite/server';
import { isValidLocale } from '@/shared/i18n/helpers';

/** `GET /api/favorites?lang=en` — the visitor's wishlist (cookie), `{ items }`. */
export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');
  if (!isValidLocale(lang)) {
    return NextResponse.json({ error: 'invalid_lang' }, { status: 400 });
  }

  return NextResponse.json({ items: await getFavoriteItems(lang) });
}
