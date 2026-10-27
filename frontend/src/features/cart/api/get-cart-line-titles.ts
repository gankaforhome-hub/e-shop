import 'server-only';

import { getLocalizedProducts } from '@/entities/product';
import { type Locale } from '@/shared/i18n/routing';

/** Upper bound for ids per request (a cart line cap well above real carts). */
const MAX_IDS = 100;

/**
 * Product titles in `lang` for cart lines, keyed by variant id. Unknown ids
 * are skipped, so the client keeps its stored title for them.
 */
export async function getCartLineTitles(
  lang: Locale,
  variantIds: readonly string[],
): Promise<Record<string, string>> {
  const wanted = new Set(variantIds.slice(0, MAX_IDS));
  if (wanted.size === 0) {
    return {};
  }

  const titles: Record<string, string> = {};
  for (const product of await getLocalizedProducts(lang)) {
    for (const variant of product.variants) {
      if (wanted.has(variant.id) && product.title) {
        titles[variant.id] = product.title;
      }
    }
  }
  return titles;
}
