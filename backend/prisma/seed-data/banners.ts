import { type E_Locale } from '@prisma/client';

// Home hero slides, in hero order: the former collection banners (dictionaries/*/home.json).
// Collection slides without a title of their own: the API shows the collection title.
export interface ISeedBanner {
  collectionSlug: string;
  // Relative to frontend/public, a wide 16:9 image
  image: string;
  subtitles: Record<E_Locale, string>;
}

export const SEED_BANNERS: ISeedBanner[] = [
  {
    collectionSlug: 'konyushina',
    image: 'images/hero_image.webp',
    subtitles: { uk: 'нова колекція', en: 'new collection' },
  },
  {
    collectionSlug: 'winter',
    image: 'images/hero_image_2.webp',
    subtitles: { uk: 'популярна колекція', en: 'popular collection' },
  },
];
