import {
  type AdminCollection,
  getCollectionTitle,
} from '@/entities/collection';

/** `custom` is the saved order (and the only one rows can be dragged in). */
export type CollectionSort = 'custom' | 'alpha' | 'newest';
export type VisibilityFilter = 'all' | 'visible' | 'hidden';
export type BannerFilter = 'all' | 'in' | 'out';

export type ListView = {
  sort: CollectionSort;
  visibility: VisibilityFilter;
  banner: BannerFilter;
};

export const DEFAULT_VIEW: ListView = {
  sort: 'custom',
  visibility: 'all',
  banner: 'all',
};

// uk titles, case- and accent-insensitive; numbers compare by value (Collection 2 < 10)
const titleCollator = new Intl.Collator('uk', {
  sensitivity: 'base',
  numeric: true,
});

/** Collections in `sort` order; `custom` follows the draft order of ids. */
export function sortCollections(
  collections: AdminCollection[],
  sort: CollectionSort,
  customOrder: readonly string[],
): AdminCollection[] {
  if (sort === 'alpha') {
    return collections.toSorted((a, b) =>
      titleCollator.compare(getCollectionTitle(a), getCollectionTitle(b)),
    );
  }
  if (sort === 'newest') {
    // ISO dates compare as strings
    return collections.toSorted((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
  const byId = new Map(collections.map(item => [item.id, item]));
  return customOrder.flatMap(id => byId.get(id) ?? []);
}

export function matchesFilters(
  collection: AdminCollection,
  { visibility, banner }: ListView,
): boolean {
  const visibilityOk =
    visibility === 'all' || collection.isActive === (visibility === 'visible');
  const bannerOk =
    banner === 'all' || collection.bannerCount > 0 === (banner === 'in');
  return visibilityOk && bannerOk;
}

/** Rows can be dragged only in the saved order over the whole, unfiltered list. */
export const canReorder = (view: ListView) =>
  view.sort === 'custom' && view.visibility === 'all' && view.banner === 'all';

export const isSameOrder = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id, index) => id === b[index]);
