import { type NextRequest, NextResponse } from 'next/server';

import { searchCatalog } from '@/features/product-search/server';
import { isValidLocale } from '@/shared/i18n/helpers';

/**
 * `GET /api/search?lang=en&q=plate` — header search: product cards, their
 * total and category/collection/season shortcuts (`SearchResponse`).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lang = searchParams.get('lang');
  if (!isValidLocale(lang)) {
    return NextResponse.json({ error: 'invalid_lang' }, { status: 400 });
  }

  return NextResponse.json(
    await searchCatalog({ lang, query: searchParams.get('q') ?? '' }),
  );
}
