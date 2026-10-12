/** Marks cards whose id is in `favoriteIds`; returns new objects. */
export function withFavorites<T extends { id: string; isFavorite: boolean }>(
  items: readonly T[],
  favoriteIds: ReadonlySet<string>,
): T[] {
  return items.map(item => ({ ...item, isFavorite: favoriteIds.has(item.id) }));
}
