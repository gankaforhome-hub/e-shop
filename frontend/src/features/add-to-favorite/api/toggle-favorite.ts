'use server';

import { cookies } from 'next/headers';

import {
  FAVORITE_IDS_COOKIE,
  favoriteIdSchema,
  MAX_FAVORITE_IDS,
  parseFavoriteIds,
} from '@/shared/lib/favorites';

export async function toggleFavorite(productId: string) {
  const id = favoriteIdSchema.parse(productId);
  const cookieStore = await cookies();
  const favoriteIds = parseFavoriteIds(
    cookieStore.get(FAVORITE_IDS_COOKIE)?.value,
  );

  // At the cap the oldest favorite makes room, so the cookie stays under 4 KB
  const updatedFavorites = favoriteIds.includes(id)
    ? favoriteIds.filter(favoriteId => favoriteId !== id)
    : [...favoriteIds, id].slice(-MAX_FAVORITE_IDS);

  // Persist favorites for 30 days
  cookieStore.set(FAVORITE_IDS_COOKIE, JSON.stringify(updatedFavorites), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax',
  });
  // Setting a cookie in a Server Action re-renders the current route, so
  // favorites-aware grids refresh without path/tag revalidation.
}
