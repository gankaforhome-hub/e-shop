/**
 * Comparator for CMS-ordered entities: `sortOrder` ascending, entries without
 * one last. Equal results keep the incoming order (sorts are stable), so
 * callers can chain a secondary key with `||`.
 */
export const compareSortOrder = (
  a: { sortOrder?: number | undefined },
  b: { sortOrder?: number | undefined },
): number =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
  (b.sortOrder ?? Number.MAX_SAFE_INTEGER);
