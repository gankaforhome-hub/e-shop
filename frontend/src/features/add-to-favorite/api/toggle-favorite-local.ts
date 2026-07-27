'use client';

export async function toggleFavoriteLocal(
  productId: string,
): Promise<{ isFavorite: boolean }> {
  // Імітуємо затримку мережі
  await new Promise(res => setTimeout(res, 200));

  const favoritesRaw = localStorage.getItem('favorite_ids');
  const favoriteIds: string[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];

  const exists = favoriteIds.includes(productId);
  const updatedFavorites = exists
    ? favoriteIds.filter(id => id !== productId)
    : [...favoriteIds, productId];

  localStorage.setItem('favorite_ids', JSON.stringify(updatedFavorites));

  return { isFavorite: !exists };
}
