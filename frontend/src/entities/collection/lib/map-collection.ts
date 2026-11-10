import { toMedia } from '@/shared/api/public-media';

import {
  type CollectionResponse,
  type SeasonResponse,
} from '../model/api-types';
import { type SeasonDTO } from '../model/season';
import { type CollectionDTO } from '../model/types';

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
  const { season, skuPrefix } = response;

  return {
    id: response.id,
    slug: response.slug,
    sortOrder: response.sortOrder,
    media: toMedia(response.media),
    ...(skuPrefix && { skuPrefix }),
    ...(season && { season: season.slug }),
    title: response.title,
    shortDescription: response.shortDescription,
    description: response.description,
    seo: response.seo,
  };
}

/** API season → `SeasonDTO` (the API already resolves the label). */
export const mapSeason = ({
  slug,
  label,
  sortOrder,
}: SeasonResponse): SeasonDTO => ({ slug, label, sortOrder });
