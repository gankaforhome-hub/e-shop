import { cookies } from 'next/headers';

import 'server-only';

import { FAVORITE_IDS_COOKIE, parseFavoriteIds } from '@/shared/lib/favorites';

/** Reads the current user's favorite product ids (request-time data). */
export async function getFavoriteIds(): Promise<ReadonlySet<string>> {
  const cookieStore = await cookies();
  return new Set(parseFavoriteIds(cookieStore.get(FAVORITE_IDS_COOKIE)?.value));
}
