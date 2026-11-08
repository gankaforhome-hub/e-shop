//COMMENT storefront cache tags; keep in sync with frontend/src/shared/config/cache-tags.ts
export const storefrontTags = {
  collections: 'collections',
  collection: (slug: string) => `collection-${slug}`,
} as const;
