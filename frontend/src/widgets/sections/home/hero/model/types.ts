import {
  type AppRoutes,
  type CmsPath,
  type ExternalHref,
} from '@/shared/config';
import { type Media } from '@/shared/types';

export interface TBannerSlide {
  id?: string;
  title: string;
  subTitle: string;
  /** Where the button leads: a collection, a known route, a CMS path or an external link. */
  href: AppRoutes | ExternalHref | CmsPath;
  /** Button text, already resolved (own text or the default for the link type). */
  ctaLabel: string;
  media: Media;
  blurDataURL?: string;
}
