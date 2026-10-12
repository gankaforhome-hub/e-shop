'use server';

import { cookies } from 'next/headers';

import { z } from 'zod';

import { FAVORITE_IDS_COOKIE, parseFavoriteIds } from '@/shared/lib/favorites';

const productIdSchema = z.string().min(1).max(100);

export async function toggleFavorite(productId: string) {
  const id = productIdSchema.parse(productId);
  const cookieStore = await cookies();
  const favoriteIds = parseFavoriteIds(
    cookieStore.get(FAVORITE_IDS_COOKIE)?.value,
  );

  const updatedFavorites = favoriteIds.includes(id)
    ? favoriteIds.filter(favoriteId => favoriteId !== id)
    : [...favoriteIds, id];

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
