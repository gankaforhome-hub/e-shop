/**
 * Cache tags shared by `'use cache'` DAL reads and the Server Actions / CMS
 * webhooks that invalidate them (`revalidateTag` / `updateTag`).
 */
export const cacheTags = {
  products: 'products',
  product: (id: string) => `product-${id}`,
  categories: 'categories',
  category: (slug: string) => `category-${slug}`,
  collections: 'collections',
  collection: (slug: string) => `collection-${slug}`,
  /** Season entities and their translations. */
  seasons: 'seasons',
  /** Attribute names / value labels (`attribute_*_translations`). */
  attributes: 'attributes',
  infoPages: 'info-pages',
  infoPage: (slug: string, lang: string) => `info-${slug}-${lang}`,
} as const;

const STATIC_TAGS: ReadonlySet<string> = new Set([
  cacheTags.products,
  cacheTags.categories,
  cacheTags.collections,
  cacheTags.seasons,
  cacheTags.attributes,
  cacheTags.infoPages,
]);

/** Templated tags a webhook may purge: `<prefix>-<slug or id>`. */
const TEMPLATED_TAG =
  /^(?:product|category|collection)-[a-z0-9][a-z0-9-]{0,99}$/;

/** `true` for a tag a CMS webhook is allowed to revalidate (whitelist). */
export function isRevalidatableTag(tag: string): boolean {
  return STATIC_TAGS.has(tag) || TEMPLATED_TAG.test(tag);
}
