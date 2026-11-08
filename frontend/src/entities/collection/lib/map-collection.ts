import { type Media } from '@/shared/types';

import {
  type CollectionMediaResponse,
  type CollectionResponse,
  type SeasonResponse,
} from '../model/api-types';
import { type SeasonDTO } from '../model/season';
import { type CollectionDTO } from '../model/types';

/** API media → `Media` for `AppMedia` (blur placeholder only when generated). */
export const mapCollectionMedia = ({
  id,
  src,
  alt,
  blurDataUrl,
  width,
  height,
  objectPosition,
}: CollectionMediaResponse): Media => ({
  id,
  src,
  alt,
  ...(blurDataUrl && { blurDataURL: blurDataUrl }),
  width,
  height,
  objectPosition,
});

/**
 * API collection → `CollectionDTO`. `null` when it has no cover: every
 * storefront view of a collection (card, page, menu target) needs one.
 */
export function mapCollection(
  response: CollectionResponse,
): CollectionDTO | null {
  if (!response.media) {
    return null;
  }
  const { banner, bannerSubtitle, season, skuPrefix } = response;

  return {
    id: response.id,
    slug: response.slug,
    sortOrder: response.sortOrder,
    media: mapCollectionMedia(response.media),
    ...(skuPrefix && { skuPrefix }),
    ...(season && { season: season.slug }),
    title: response.title,
    shortDescription: response.shortDescription,
    description: response.description,
    seo: response.seo,
    ...(banner && { banner: mapCollectionMedia(banner) }),
    inBanner: response.inBanner,
    ...(bannerSubtitle && { bannerSubtitle }),
  };
}

/** API season → `SeasonDTO` (the API already resolves the label). */
export const mapSeason = ({
  slug,
  label,
  sortOrder,
}: SeasonResponse): SeasonDTO => ({ slug, label, sortOrder });

/** One home hero slide (shape compatible with the hero widget's `TBannerSlide`). */
export type HeroBannerDTO = {
  id: string;
  title: string;
  subTitle: string;
  slug: string;
  media: Media;
};

/** API collection → hero slide; `null` without a banner image. */
export function mapHeroBanner(
  response: CollectionResponse,
): HeroBannerDTO | null {
  if (!response.banner) {
    return null;
  }

  return {
    id: response.slug,
    title: response.title,
    subTitle: response.bannerSubtitle ?? '',
    slug: response.slug,
    media: mapCollectionMedia(response.banner),
  };
}
