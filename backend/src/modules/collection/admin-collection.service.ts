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
  CollectionOrderDto,
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
] as const satisfies (keyof CollectionCoreDto)[];

// A translation replaces the row as a whole, so omitted optional fields are cleared
const toTranslationData = (t: CollectionTranslationDto): TranslationData => ({
  metaTitle: null,
  metaDescription: null,
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

  //COMMENT the whole list in its new order: a stale list (someone added or removed a
  //COMMENT collection meanwhile) is refused instead of leaving gaps
  async setOrder(
    { ids }: CollectionOrderDto,
    { actorId, ip }: ICollectionActor,
  ): Promise<void> {
    const total = await this.repository.countAll();
    if (
      ids.length !== total ||
      (await this.repository.countByIds(ids)) !== total
    ) {
      throw new BadRequestException(
        'ids must list every collection exactly once',
      );
    }
    await this.repository.setOrder(ids, {
      actorId,
      ip,
      action: 'collection.reorder',
      meta: { ids },
    });
    this.notifyStorefront();
  }

  //COMMENT translations go by cascade; media stays in the library
  async remove(id: string, { actorId, ip }: ICollectionActor): Promise<void> {
    const { slug, _count } = await this.getOrThrow(id);
    //COMMENT a hero slide would lose its link: the banner is changed or removed first
    if (_count.banners > 0) {
      throw new ConflictException(
        `The collection is used by ${_count.banners} banner(s)`,
      );
    }
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

  // Banners take their fallback title and visibility from the collection
  private notifyStorefront(...slugs: (string | null | undefined)[]) {
    this.revalidation.notify([
      storefrontTags.collections,
      storefrontTags.banners,
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
    seasonSlug,
  }: CollectionCoreDto) {
    if (coverImageId) {
      const existing = await this.repository.existingMediaIds([coverImageId]);
      if (!existing.has(coverImageId)) {
        throw new BadRequestException('coverImageId: media not found');
      }
    }
    if (seasonSlug && !(await this.repository.seasonExists(seasonSlug))) {
      throw new BadRequestException('seasonSlug: season not found');
    }
  }

  private async assertUnique({ slug }: CollectionCoreDto, exceptId?: string) {
    if (slug && (await this.repository.slugTaken(slug, exceptId))) {
      throw new ConflictException('slug is already taken');
    }
  }

  //COMMENT the same checks lost a race with another request
  private rethrow(error: unknown): never {
    if (isPrismaError(error, 'P2002')) {
      throw new ConflictException('slug is already taken');
    }
    //COMMENT the SKU prefix sequence stops at 999 (three digits)
    if (
      error instanceof Error &&
      error.message.includes('collection_sku_prefix_seq')
    ) {
      throw new ConflictException(
        'No free collection SKU prefix: 001-999 are all used',
      );
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
      coverImage:
        collection.coverImage &&
        this.mediaService.toResponse(collection.coverImage),
      bannerCount: collection._count.banners,
      translations: collection.translations.map(t => ({
        languageCode: t.languageCode,
        title: t.title,
        shortDescription: t.shortDescription,
        description: t.description,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      })),
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
  }
}
