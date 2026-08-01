import { type Media } from '@/shared/types';

export interface TBannerSlide {
  id?: string;
  title: string;
  subTitle: string;
  slug: string;
  media: Media;
  blurDataURL?: string;
}
