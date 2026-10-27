import { type NextRequest, NextResponse } from 'next/server';

import { getCartLineTitles } from '@/features/cart/server';
import { isValidLocale } from '@/shared/i18n/helpers';

/**
 * `GET /api/cart/titles?lang=en&ids=v1,v2` — product titles of cart lines in
 * `lang`, `{ titles: { [variantId]: title } }`.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lang = searchParams.get('lang');
  if (!isValidLocale(lang)) {
    return NextResponse.json({ error: 'invalid_lang' }, { status: 400 });
  }

  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  return NextResponse.json({ titles: await getCartLineTitles(lang, ids) });
}
