import { type Locale } from '@/shared/i18n/routing';
import { type Media } from '@/shared/types';

// The main model of the collection
export interface Collection {
  id: string;
  slug: string;
  media: Media;
}

// Table of translations
export interface CollectionTranslation {
  collectionId: string;
  languageCode: Locale;
  title: string;
  shortDescription: string;
  description: string;
}

//M:N Connection Collection and Category
export interface CollectionCategory {
  collectionId: string;
  categoryId: string;
}

// SEO Meta Data (from i18n)
export interface CollectionSeo {
  collectionId: string;
  languageCode: Locale;
  title: string;
  description: string;
}
