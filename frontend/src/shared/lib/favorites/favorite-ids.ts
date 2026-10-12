import { z } from 'zod';

export const FAVORITE_IDS_COOKIE = 'favorite_ids';

const favoriteIdsSchema = z.array(z.string().min(1)).max(500);

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
