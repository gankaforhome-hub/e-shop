import { z } from 'zod';

export const FAVORITE_IDS_COOKIE = 'favorite_ids';

/**
 * Cookie budget: browsers drop cookies over ~4 KB, so the wishlist keeps the
 * newest `MAX_FAVORITE_IDS` ids of at most `MAX_FAVORITE_ID_LENGTH` chars
 * (UUID-sized) — about 4 KB in the worst case.
 */
export const MAX_FAVORITE_IDS = 100;
export const MAX_FAVORITE_ID_LENGTH = 36;

export const favoriteIdSchema = z.string().min(1).max(MAX_FAVORITE_ID_LENGTH);

// Lenient on read: an older, longer cookie is trimmed rather than discarded
const favoriteIdsSchema = z
  .array(favoriteIdSchema)
  .transform(ids => ids.slice(-MAX_FAVORITE_IDS));

/** Safely parses the favorites cookie value; any malformed input yields `[]`. */
export function parseFavoriteIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  try {
    const result = favoriteIdsSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}
