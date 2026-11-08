import { toObjectPosition } from '@modules/media/lib/media.util';
import {
  IMediaStorage,
  IStoredMediaVariant,
  MEDIA_STORAGE,
} from '@modules/media/interfaces';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { E_Locale, Media } from '@prisma/client';
import {
  CollectionRepository,
  CollectionWithRelations,
} from './repository/collection.repository';
import {
  CollectionMediaResponse,
  CollectionResponse,
  SeasonResponse,
} from './responses';

const FALLBACK_LOCALE = E_Locale.uk;

// The requested language first, then the fallback
const pickTranslation = <T extends { languageCode: E_Locale }>(
  translations: T[],
  lang: E_Locale,
): T | undefined =>
  translations.find(t => t.languageCode === lang) ??
  translations.find(t => t.languageCode === FALLBACK_LOCALE);

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    @Inject(MEDIA_STORAGE) private readonly storage: IMediaStorage,
  ) {}

  private locales(lang: E_Locale) {
    return [...new Set([lang, FALLBACK_LOCALE])];
  }

  async findAll(lang: E_Locale): Promise<CollectionResponse[]> {
    const collections = await this.collectionRepository.findActive(
      this.locales(lang),
    );
    return this.toResponses(collections, lang);
  }

  // Home hero slides, in bannerSortOrder
  async findBanners(lang: E_Locale): Promise<CollectionResponse[]> {
    const collections = await this.collectionRepository.findInBanner(
      this.locales(lang),
    );
    return this.toResponses(collections, lang);
  }

  async findBySlug(slug: string, lang: E_Locale): Promise<CollectionResponse> {
    const collection = await this.collectionRepository.findActiveBySlug(
      slug,
      this.locales(lang),
    );
    const response = collection && this.toResponse(collection, lang);
    if (!response) throw new NotFoundException('Collection not found');
    return response;
  }

  async findSeasons(lang: E_Locale): Promise<SeasonResponse[]> {
    const seasons = await this.collectionRepository.findSeasons(
      this.locales(lang),
    );
    return seasons.map(({ slug, sortOrder, translations }) => ({
      slug,
      label: pickTranslation(translations, lang)?.label ?? slug,
      sortOrder,
    }));
  }

  private toResponses(
    collections: CollectionWithRelations[],
    lang: E_Locale,
  ): CollectionResponse[] {
    return collections
      .map(collection => this.toResponse(collection, lang))
      .filter(collection => collection !== null);
  }

  //COMMENT null when there is no text in either language: the collection can't be shown
  private toResponse(
    collection: CollectionWithRelations,
    lang: E_Locale,
  ): CollectionResponse | null {
    const translation = pickTranslation(collection.translations, lang);
    if (!translation) return null;

    const { season, coverImage, bannerImage } = collection;
    return {
      id: collection.id,
      slug: collection.slug,
      sortOrder: collection.sortOrder,
      skuPrefix: collection.skuPrefix,
      season: season && {
        slug: season.slug,
        label: pickTranslation(season.translations, lang)?.label ?? season.slug,
      },
      title: translation.title,
      shortDescription: translation.shortDescription,
      description: translation.description,
      seo: {
        title: translation.metaTitle ?? translation.title,
        description:
          translation.metaDescription ?? translation.shortDescription,
      },
      media: coverImage && this.toMedia(coverImage, translation.title),
      //COMMENT no fallback to the cover: a square photo doesn't fit a 16:9 slot
      banner: bannerImage && this.toMedia(bannerImage, translation.title),
      inBanner: collection.inBanner,
      bannerSortOrder: collection.bannerSortOrder,
      bannerSubtitle: translation.bannerSubtitle || null,
    };
  }

  private toMedia(media: Media, fallbackAlt: string): CollectionMediaResponse {
    //COMMENT Prisma types Json loosely; only the media pipeline writes this column
    const stored = media.variants as unknown as IStoredMediaVariant[];
    const variants = stored.map(({ width, height, key }) => ({
      width,
      height,
      src: this.storage.publicUrl(key),
    }));

    return {
      id: media.id,
      src: variants[variants.length - 1].src,
      alt: media.alt ?? fallbackAlt,
      width: media.width,
      height: media.height,
      blurDataUrl: media.blurDataUrl,
      focalX: media.focalX,
      focalY: media.focalY,
      objectPosition: toObjectPosition(media.focalX, media.focalY),
      variants,
    };
  }
}
