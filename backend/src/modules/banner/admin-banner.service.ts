import { isPrismaError } from '@common/utils';
import { MediaService } from '@modules/media/media.service';
import { storefrontTags } from '@modules/revalidation/revalidation.constants';
import { RevalidationService } from '@modules/revalidation/revalidation.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { E_BannerLinkType, E_Locale } from '@prisma/client';
import {
  BannerOrderDto,
  BannerTranslationDto,
  CreateBannerDto,
  UpdateBannerDto,
} from './dto/banner.dto';
import {
  AdminBanner,
  BannerData,
  BannerRepository,
  BannerText,
} from './repository/banner.repository';
import {
  AdminBannerResponse,
  BannerLinkTargetResponse,
  BannerStatus,
} from './responses/banner.response';

export interface IBannerActor {
  actorId: string;
  ip: string;
}

// Empty strings are no text: the fallbacks (collection title, default button) apply
const toText = ({
  languageCode,
  title,
  subtitle,
  ctaLabel,
}: BannerTranslationDto): BannerText => ({
  languageCode,
  title: title?.trim() || null,
  subtitle: subtitle?.trim() || null,
  ctaLabel: ctaLabel?.trim() || null,
});

const toDate = (value: string | null | undefined, current: Date | null) =>
  value === undefined ? current : value ? new Date(value) : null;

@Injectable()
export class AdminBannerService {
  constructor(
    private readonly repository: BannerRepository,
    private readonly mediaService: MediaService,
    private readonly revalidation: RevalidationService,
  ) {}

  async findAll(): Promise<AdminBannerResponse[]> {
    const now = new Date();
    return (await this.repository.findAll()).map(banner =>
      this.toResponse(banner, now),
    );
  }

  async findOne(id: string): Promise<AdminBannerResponse> {
    return this.toResponse(await this.getOrThrow(id), new Date());
  }

  async linkTargets(): Promise<BannerLinkTargetResponse[]> {
    return this.repository.findLinkTargets();
  }

  async create(
    { translations = [], ...dto }: CreateBannerDto,
    { actorId, ip }: IBannerActor,
  ): Promise<AdminBannerResponse> {
    const texts = translations.map(toText);
    const data = await this.resolve(dto, texts);

    const id = await this.repository
      .create(data, texts, { actorId, ip, action: 'banner.create' })
      .catch(error => this.rethrow(error));
    this.notifyStorefront();
    return this.findOne(id);
  }

  async update(
    id: string,
    { translations, ...dto }: UpdateBannerDto,
    { actorId, ip }: IBannerActor,
  ): Promise<AdminBannerResponse> {
    const current = await this.getOrThrow(id);
    const texts = (translations ?? []).map(toText);
    // The texts after this PATCH: listed languages replace the stored ones
    const merged = [
      ...current.translations.filter(
        t => !texts.some(text => text.languageCode === t.languageCode),
      ),
      ...texts,
    ];
    const data = await this.resolve(dto, merged, current);

    await this.repository
      .update(id, data, texts, {
        actorId,
        ip,
        action: 'banner.update',
        targetId: id,
        meta: { fields: Object.keys(dto) },
      })
      .catch(error => this.rethrow(error));
    this.notifyStorefront();
    return this.findOne(id);
  }

  //COMMENT the whole list in its new order: a stale list is refused instead of leaving gaps
  async setOrder(
    { ids }: BannerOrderDto,
    { actorId, ip }: IBannerActor,
  ): Promise<void> {
    const total = await this.repository.countAll();
    if (
      ids.length !== total ||
      (await this.repository.countByIds(ids)) !== total
    ) {
      throw new BadRequestException('ids must list every banner exactly once');
    }
    await this.repository.setOrder(ids, {
      actorId,
      ip,
      action: 'banner.reorder',
      meta: { ids },
    });
    this.notifyStorefront();
  }

  //COMMENT the image stays in the media library
  async remove(id: string, { actorId, ip }: IBannerActor): Promise<void> {
    await this.getOrThrow(id);
    await this.repository
      .delete(id, { actorId, ip, action: 'banner.delete', targetId: id })
      .catch(error => this.rethrow(error));
    this.notifyStorefront();
  }

  /**
   * The banner's state after this request, checked as a whole: the link matches its type
   * (the other link field is cleared), references exist, a URL slide has a uk title and
   * the schedule ends after it starts.
   */
  private async resolve(
    dto: Omit<UpdateBannerDto, 'translations'>,
    texts: BannerText[],
    current?: AdminBanner,
  ): Promise<BannerData> {
    const linkType = dto.linkType ?? current?.linkType;
    const imageId = dto.imageId ?? current?.imageId;
    if (!linkType || !imageId) {
      throw new BadRequestException('linkType and imageId are required');
    }

    const isCollection = linkType === E_BannerLinkType.COLLECTION;
    const collectionId = isCollection
      ? dto.collectionId !== undefined
        ? dto.collectionId
        : (current?.collectionId ?? null)
      : null;
    const url = isCollection
      ? null
      : dto.url !== undefined
        ? dto.url
        : (current?.url ?? null);

    if (isCollection && !collectionId) {
      throw new BadRequestException(
        'collectionId is required for a collection link',
      );
    }
    if (!isCollection && !url) {
      throw new BadRequestException('url is required for a link banner');
    }
    if (
      !isCollection &&
      !texts.find(t => t.languageCode === E_Locale.uk)?.title
    ) {
      throw new BadRequestException('A link banner needs a uk title');
    }
    if (
      collectionId &&
      !(await this.repository.collectionExists(collectionId))
    ) {
      throw new BadRequestException('collectionId: collection not found');
    }
    if (dto.imageId && !(await this.repository.mediaExists(dto.imageId))) {
      throw new BadRequestException('imageId: media not found');
    }

    const startsAt = toDate(dto.startsAt, current?.startsAt ?? null);
    const endsAt = toDate(dto.endsAt, current?.endsAt ?? null);
    if (startsAt && endsAt && endsAt <= startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    return {
      linkType,
      collectionId,
      url,
      imageId,
      isActive: dto.isActive ?? current?.isActive ?? false,
      startsAt,
      endsAt,
    };
  }

  private notifyStorefront() {
    this.revalidation.notify([storefrontTags.banners]);
  }

  private async getOrThrow(id: string): Promise<AdminBanner> {
    const banner = await this.repository.findById(id);
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  //COMMENT the same checks lost a race with another request
  private rethrow(error: unknown): never {
    if (isPrismaError(error, 'P2003')) {
      throw new BadRequestException('A referenced media or collection is gone');
    }
    if (isPrismaError(error, 'P2025')) {
      throw new NotFoundException('Banner not found');
    }
    throw error;
  }

  private status(banner: AdminBanner, now: Date): BannerStatus {
    if (!banner.isActive) return 'hidden';
    if (banner.startsAt && banner.startsAt > now) return 'scheduled';
    if (banner.endsAt && banner.endsAt <= now) return 'expired';
    return 'live';
  }

  private toResponse(banner: AdminBanner, now: Date): AdminBannerResponse {
    return {
      id: banner.id,
      linkType: banner.linkType,
      collection: banner.collection,
      url: banner.url,
      image: this.mediaService.toResponse(banner.image),
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
      startsAt: banner.startsAt,
      endsAt: banner.endsAt,
      status: this.status(banner, now),
      translations: banner.translations.map(
        ({ languageCode, title, subtitle, ctaLabel }) => ({
          languageCode,
          title,
          subtitle,
          ctaLabel,
        }),
      ),
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    };
  }
}
