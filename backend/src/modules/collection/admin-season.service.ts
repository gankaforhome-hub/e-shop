import { isPrismaError } from '@common/utils';
import { storefrontTags } from '@modules/revalidation/revalidation.constants';
import { RevalidationService } from '@modules/revalidation/revalidation.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICollectionActor } from './admin-collection.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto';
import {
  AdminSeason,
  AdminSeasonRepository,
} from './repository/admin-season.repository';
import { AdminSeasonResponse } from './responses';

@Injectable()
export class AdminSeasonService {
  constructor(
    private readonly repository: AdminSeasonRepository,
    private readonly revalidation: RevalidationService,
  ) {}

  async findAll(): Promise<AdminSeasonResponse[]> {
    const seasons = await this.repository.findAll();
    return seasons.map(season => this.toResponse(season));
  }

  async create(
    { slug, sortOrder = 0, translations }: CreateSeasonDto,
    { actorId, ip }: ICollectionActor,
  ): Promise<AdminSeasonResponse> {
    if (await this.repository.findBySlug(slug)) {
      throw new ConflictException('slug is already taken');
    }
    await this.repository
      .create(slug, sortOrder, translations, {
        actorId,
        ip,
        action: 'season.create',
        targetId: slug,
      })
      .catch(error => this.rethrow(error));
    this.notifyStorefront();
    return this.toResponse(await this.getOrThrow(slug));
  }

  async update(
    slug: string,
    { sortOrder, translations = [] }: UpdateSeasonDto,
    { actorId, ip }: ICollectionActor,
  ): Promise<AdminSeasonResponse> {
    await this.getOrThrow(slug);
    await this.repository
      .update(slug, sortOrder, translations, {
        actorId,
        ip,
        action: 'season.update',
        targetId: slug,
      })
      .catch(error => this.rethrow(error));
    this.notifyStorefront();
    return this.toResponse(await this.getOrThrow(slug));
  }

  //COMMENT a season in use is not removed: its collections would silently lose it
  async remove(slug: string, { actorId, ip }: ICollectionActor): Promise<void> {
    const season = await this.getOrThrow(slug);
    if (season._count.collections > 0) {
      throw new ConflictException(
        `The season is used by ${season._count.collections} collection(s)`,
      );
    }
    await this.repository
      .delete(slug, { actorId, ip, action: 'season.delete', targetId: slug })
      .catch(error => this.rethrow(error));
    this.notifyStorefront();
  }

  // Labels show up in the season filter and in every collection response
  private notifyStorefront() {
    this.revalidation.notify([
      storefrontTags.seasons,
      storefrontTags.collections,
    ]);
  }

  private async getOrThrow(slug: string): Promise<AdminSeason> {
    const season = await this.repository.findBySlug(slug);
    if (!season) throw new NotFoundException('Season not found');
    return season;
  }

  //COMMENT the same checks lost a race with another request
  private rethrow(error: unknown): never {
    if (isPrismaError(error, 'P2002')) {
      throw new ConflictException('slug is already taken');
    }
    if (isPrismaError(error, 'P2025')) {
      throw new NotFoundException('Season not found');
    }
    throw error;
  }

  private toResponse(season: AdminSeason): AdminSeasonResponse {
    return {
      slug: season.slug,
      sortOrder: season.sortOrder,
      translations: season.translations.map(({ languageCode, label }) => ({
        languageCode,
        label,
      })),
      collectionCount: season._count.collections,
      createdAt: season.createdAt,
      updatedAt: season.updatedAt,
    };
  }
}
