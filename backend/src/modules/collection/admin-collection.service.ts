import { isPrismaError } from '@common/utils';
import { MediaService } from '@modules/media/media.service';
import { storefrontTags } from '@modules/revalidation/revalidation.constants';
import { RevalidationService } from '@modules/revalidation/revalidation.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BannerOrderDto,
  CollectionTranslationDto,
  CreateCollectionDto,
  UpdateCollectionDto,
} from './dto';
import {
  AdminCollection,
  AdminCollectionRepository,
  TranslationData,
} from './repository/admin-collection.repository';
import { AdminCollectionResponse } from './responses';

export interface ICollectionActor {
  actorId: string;
  ip: string;
}

type CollectionCoreDto = Omit<UpdateCollectionDto, 'translations'>;

// Columns without NULL in the database; PATCH may omit them but not clear them
const NOT_NULLABLE = [
  'slug',
  'sortOrder',
  'isActive',
  'inBanner',
  'bannerSortOrder',
] as const satisfies (keyof CollectionCoreDto)[];

const BANNER_REQUIRED =
  'A collection can be in the hero only with a banner image: set bannerImageId or turn inBanner off';

// A translation replaces the row as a whole, so omitted optional fields are cleared
const toTranslationData = (t: CollectionTranslationDto): TranslationData => ({
  metaTitle: null,
  metaDescription: null,
  bannerSubtitle: null,
  ...t,
});

@Injectable()
export class AdminCollectionService {
  constructor(
    private readonly repository: AdminCollectionRepository,
    private readonly mediaService: MediaService,
    private readonly revalidation: RevalidationService,
  ) {}

  async findAll(): Promise<AdminCollectionResponse[]> {
    const collections = await this.repository.findAll();
    return collections.map(collection => this.toResponse(collection));
  }

  async findOne(id: string): Promise<AdminCollectionResponse> {
    return this.toResponse(await this.getOrThrow(id));
  }

  async create(
    { translations, ...core }: CreateCollectionDto,
    { actorId, ip }: ICollectionActor,
  ): Promise<AdminCollectionResponse> {
    await this.assertReferences(core);
    if (core.inBanner && !core.bannerImageId) {
      throw new BadRequestException(BANNER_REQUIRED);
    }
    await this.assertUnique(core);

    const id = await this.repository
      .create(core, translations.map(toTranslationData), {
        actorId,
        ip,
        action: 'collection.create',
        meta: { slug: core.slug },
      })
      .catch(error => this.rethrow(error));
    this.notifyStorefront(core.slug);
    return this.findOne(id);
  }

  async update(
    id: string,
    { translations, ...core }: UpdateCollectionDto,
    { actorId, ip }: ICollectionActor,
  ): Promise<AdminCollectionResponse> {
    const current = await this.getOrThrow(id);
    for (const key of NOT_NULLABLE) {
      if (core[key] === null) {
        throw new BadRequestException(`${key} can not be null`);
      }
    }
    await this.assertReferences(core);

    //COMMENT the state after this PATCH, so both turning inBanner on and removing the
    //banner image are caught before the database CHECK
    const inBanner = core.inBanner ?? current.inBanner;
    const bannerImageId =
      core.bannerImageId !== undefined
        ? core.bannerImageId
        : current.bannerImageId;
    if (inBanner && !bannerImageId) {
      throw new BadRequestException(BANNER_REQUIRED);
    }
    await this.assertUnique(core, id);

    await this.repository
      .update(id, core, (translations ?? []).map(toTranslationData), {
        actorId,
        ip,
        action: 'collection.update',
        targetId: id,
        meta: {
          fields: Object.keys(core),
          languages: (translations ?? []).map(t => t.languageCode),
        },
      })
      .catch(error => this.rethrow(error));
    //COMMENT both slugs: the old page must drop out and the new one must appear
    this.notifyStorefront(current.slug, core.slug);
    return this.findOne(id);
  }

  async setBannerOrder(
    { items }: BannerOrderDto,
    { actorId, ip }: ICollectionActor,
  ): Promise<void> {
    const ids = items.map(item => item.id);
    if ((await this.repository.countByIds(ids)) !== ids.length) {
      throw new BadRequestException('items contain an unknown collection id');
    }
    await this.repository.setBannerOrder(items, {
      actorId,
      ip,
      action: 'collection.banner_order',
      meta: {
        items: items.map(({ id, bannerSortOrder }) => ({
          id,
          bannerSortOrder,
        })),
      },
    });
    this.notifyStorefront();
  }

  //COMMENT translations go by cascade; media stays in the library
  async remove(id: string, { actorId, ip }: ICollectionActor): Promise<void> {
    const { slug } = await this.getOrThrow(id);
    await this.repository
      .delete(id, {
        actorId,
        ip,
        action: 'collection.delete',
        targetId: id,
        meta: { slug },
      })
      .catch(error => this.rethrow(error));
    this.notifyStorefront(slug);
  }

  private notifyStorefront(...slugs: (string | null | undefined)[]) {
    this.revalidation.notify([
      storefrontTags.collections,
      ...slugs
        .filter((slug): slug is string => !!slug)
        .map(storefrontTags.collection),
    ]);
  }

  private async getOrThrow(id: string): Promise<AdminCollection> {
    const collection = await this.repository.findById(id);
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  // Unknown media or season is a client error (400), not a missing route (404)
  private async assertReferences({
    coverImageId,
    bannerImageId,
    seasonSlug,
  }: CollectionCoreDto) {
    const mediaIds = [coverImageId, bannerImageId].filter(
      (id): id is string => !!id,
    );
    if (mediaIds.length > 0) {
      const existing = await this.repository.existingMediaIds(mediaIds);
      if (coverImageId && !existing.has(coverImageId)) {
        throw new BadRequestException('coverImageId: media not found');
      }
      if (bannerImageId && !existing.has(bannerImageId)) {
        throw new BadRequestException('bannerImageId: media not found');
      }
    }
    if (seasonSlug && !(await this.repository.seasonExists(seasonSlug))) {
      throw new BadRequestException('seasonSlug: season not found');
    }
  }

  private async assertUnique(
    { slug, skuPrefix }: CollectionCoreDto,
    exceptId?: string,
  ) {
    const taken = await this.repository.findConflict(
      { slug: slug ?? undefined, skuPrefix },
      exceptId,
    );
    if (taken) throw new ConflictException(`${taken} is already taken`);
  }

  //COMMENT the same checks lost a race with another request
  private rethrow(error: unknown): never {
    if (isPrismaError(error, 'P2002')) {
      throw new ConflictException('slug or skuPrefix is already taken');
    }
    if (isPrismaError(error, 'P2003')) {
      throw new BadRequestException('A referenced media or season is gone');
    }
    if (isPrismaError(error, 'P2025')) {
      throw new NotFoundException('Collection not found');
    }
    throw error;
  }

  private toResponse(collection: AdminCollection): AdminCollectionResponse {
    return {
      id: collection.id,
      slug: collection.slug,
      sortOrder: collection.sortOrder,
      isActive: collection.isActive,
      skuPrefix: collection.skuPrefix,
      seasonSlug: collection.seasonSlug,
      inBanner: collection.inBanner,
      bannerSortOrder: collection.bannerSortOrder,
      coverImage:
        collection.coverImage &&
        this.mediaService.toResponse(collection.coverImage),
      bannerImage:
        collection.bannerImage &&
        this.mediaService.toResponse(collection.bannerImage),
      translations: collection.translations.map(t => ({
        languageCode: t.languageCode,
        title: t.title,
        shortDescription: t.shortDescription,
        description: t.description,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
        bannerSubtitle: t.bannerSubtitle,
      })),
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
  }
}
