/** Publication lifecycle shared by CMS-managed entities. */
export type PublishStatus = 'draft' | 'published' | 'archived';

/** Localized SEO fields stored alongside an entity translation. */
export type SeoFields = {
  title: string;
  description: string;
};

/** Optional CMS bookkeeping fields shared by catalog entities (ISO-8601 dates). */
export type EntityMeta = {
  status?: PublishStatus;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};
