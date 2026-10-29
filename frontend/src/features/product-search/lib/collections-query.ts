import { normalizeSearchText } from '@/shared/lib/utils';

/**
 * Queries that ask for the collections themselves, not for products: they
 * lead to the all-collections page. Both locales, whatever the UI language.
 */
const COLLECTIONS_QUERIES = new Set(
  [
    'колекція',
    'колекції',
    'колекцій',
    'колекцію',
    'усі колекції',
    'всі колекції',
    'collection',
    'collections',
    'all collections',
  ].map(normalizeSearchText),
);

/** `"Колекції "` / `"collections"` → `true`; `"колекція Agro"` → `false`. */
export const isCollectionsQuery = (query: string) =>
  COLLECTIONS_QUERIES.has(normalizeSearchText(query));
