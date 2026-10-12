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
} as const;
