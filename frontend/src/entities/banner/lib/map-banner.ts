import { toMedia } from '@/shared/api/public-media';
import {
  type AppRoutes,
  type CmsPath,
  type ExternalHref,
  isCmsPath,
} from '@/shared/config';
import { routes } from '@/shared/config/routes';
import { type Media } from '@/shared/types';

import { type BannerResponse } from '../model/api-types';

export type BannerLinkType = BannerResponse['link']['type'];

/** One home hero slide, ready for the hero widget. */
export type HeroBannerDTO = {
  id: string;
  title: string;
  subtitle: string;
  href: AppRoutes | ExternalHref | CmsPath;
  linkType: BannerLinkType;
  /** Own button text; without it the hero uses its default for `linkType`. */
  ctaLabel?: string;
  media: Media;
};

const HTTP_HREF = /^https?:\/\/\S+$/;

const isHttpHref = (value: string): value is ExternalHref =>
  HTTP_HREF.test(value);

/** Where a slide leads, or `null` when the API sent something unusable. */
function toHref(link: BannerResponse['link']): HeroBannerDTO['href'] | null {
  if (link.type === 'collection') {
    return link.collectionSlug ? routes.collection(link.collectionSlug) : null;
  }
  if (!link.url) {
    return null;
  }
  // The API checks the same shapes; this guards the storefront against anything else
  return isCmsPath(link.url) || isHttpHref(link.url) ? link.url : null;
}

/** API banner → hero slide; `null` when its link can't be used. */
export function mapHeroBanner(response: BannerResponse): HeroBannerDTO | null {
  const href = toHref(response.link);
  if (!href) {
    return null;
  }

  return {
    id: response.id,
    title: response.title,
    subtitle: response.subtitle ?? '',
    href,
    linkType: response.link.type,
    ...(response.ctaLabel && { ctaLabel: response.ctaLabel }),
    media: toMedia(response.image),
  };
}
