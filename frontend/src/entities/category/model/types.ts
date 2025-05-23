import { Media } from '@/shared/types';

export type Category = {
  id: string;
  slug: string;
  title: string;
  media: Media;
  description?: string;
  collectionId: string;
};
