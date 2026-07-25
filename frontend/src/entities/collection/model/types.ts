import { type Media } from '@/shared/types';

export type Collection = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  media: Media;
  categoryIds: string[];
  productIds?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
};
