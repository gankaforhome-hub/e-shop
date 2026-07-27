'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function toggleFavorite(productId: string) {
  const cookieStore = await cookies();
  const favoritesRaw = cookieStore.get('favorite_ids')?.value;
  const favoriteIds: string[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];

  let updatedFavorites: string[];

  if (favoriteIds.includes(productId)) {
    updatedFavorites = favoriteIds.filter(id => id !== productId);
  } else {
    updatedFavorites = [...favoriteIds, productId];
  }

  // Зберігаємо оновлені лайки в cookies (на 30 днів)
  cookieStore.set('favorite_ids', JSON.stringify(updatedFavorites), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  // Оновлюємо кеш сторінки каталогу
  revalidatePath('/products');
}
