import { MediaService } from '@modules/media/media.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { E_Locale } from '@prisma/client';
import {
  CollectionRepository,
  CollectionWithRelations,
} from './repository/collection.repository';
import { CollectionResponse, SeasonResponse } from './responses';

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
    private readonly mediaService: MediaService,
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

    const { season, coverImage } = collection;
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
      media:
        coverImage &&
        this.mediaService.toPublicResponse(coverImage, translation.title),
    };
  }
}
