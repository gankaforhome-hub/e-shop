import { isPrismaError } from '@common/utils';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';
import { UpdateMediaDto } from './dto';
import {
  IMediaStorage,
  IStoredMediaVariant,
  MEDIA_STORAGE,
} from './interfaces';
import { mediaKey, toObjectPosition } from './lib/media.util';
import {
  imageChecksum,
  processImage,
  UnsupportedImageError,
} from './lib/process-image';
import {
  MEDIA_ORIGINAL_NAME_MAX_LENGTH,
  MEDIA_PAGE_MAX_TAKE,
} from './media.constants';
import { MediaRepository } from './repository/media.repository';
import {
  CropDataResponse,
  MediaListResponse,
  MediaResponse,
} from './responses';

const WEBP = 'image/webp';

export interface IMediaActor {
  actorId: string;
  ip: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly mediaRepository: MediaRepository,
    @Inject(MEDIA_STORAGE) private readonly storage: IMediaStorage,
  ) {}

  /**
   * Stores a new image, or returns the existing row for a file uploaded before
   * (created: false). Files go to storage first, then the row; if the row fails,
   * the files are removed again.
   */
  async upload(
    file: Express.Multer.File | undefined,
    alt: string | undefined,
    { actorId, ip }: IMediaActor,
  ): Promise<{ media: MediaResponse; created: boolean }> {
    if (!file) throw new BadRequestException('Field "file" is required');

    const existing = await this.mediaRepository.findByChecksum(
      imageChecksum(file.buffer),
    );
    if (existing) return { media: this.toResponse(existing), created: false };

    const image = await processImage(file.buffer).catch((error: unknown) => {
      if (error instanceof UnsupportedImageError) {
        throw new UnsupportedMediaTypeException(error.message);
      }
      throw error;
    });

    const variants: IStoredMediaVariant[] = image.variants.map(
      ({ width, height, buffer }) => ({
        width,
        height,
        size: buffer.length,
        key: mediaKey(image.checksum, width),
      }),
    );
    await Promise.all(
      image.variants.map(({ buffer }, i) =>
        this.storage.put(variants[i].key, buffer, WEBP),
      ),
    );

    try {
      const media = await this.mediaRepository.create(
        {
          checksum: image.checksum,
          width: image.width,
          height: image.height,
          sizeBytes: variants[variants.length - 1].size,
          variants: variants as unknown as Prisma.InputJsonValue,
          blurDataUrl: image.blurDataUrl,
          alt: alt || null,
          originalName: file.originalname.slice(
            0,
            MEDIA_ORIGINAL_NAME_MAX_LENGTH,
          ),
          uploadedById: actorId,
        },
        { actorId, ip, action: 'media.upload' },
      );
      return { media: this.toResponse(media), created: true };
    } catch (error) {
      //COMMENT the same file uploaded at the same moment: the keys are shared, keep the files
      if (isPrismaError(error, 'P2002')) {
        const winner = await this.mediaRepository.findByChecksum(
          image.checksum,
        );
        if (winner) return { media: this.toResponse(winner), created: false };
      }
      await this.storage
        .remove(variants.map(v => v.key))
        .catch(() => undefined); // already logged by the storage
      throw error;
    }
  }

  async findPage(skip: number, take: number): Promise<MediaListResponse> {
    if (skip < 0 || take < 1 || take > MEDIA_PAGE_MAX_TAKE) {
      throw new BadRequestException(
        `skip must be ≥ 0 and take between 1 and ${MEDIA_PAGE_MAX_TAKE}`,
      );
    }
    const { items, total } = await this.mediaRepository.findPage(skip, take);
    return { items: items.map(media => this.toResponse(media)), total };
  }

  async findOne(id: string): Promise<MediaResponse> {
    return this.toResponse(await this.getOrThrow(id));
  }

  async update(
    id: string,
    { alt, focalX, focalY, cropData }: UpdateMediaDto,
    { actorId, ip }: IMediaActor,
  ): Promise<MediaResponse> {
    await this.getOrThrow(id);
    const media = await this.mediaRepository.update(
      id,
      {
        alt,
        focalX,
        focalY,
        //COMMENT null clears the crop; Prisma needs DbNull for a nullable Json column
        cropData:
          cropData === null
            ? Prisma.DbNull
            : (cropData as Prisma.InputJsonValue | undefined),
      },
      { actorId, ip, action: 'media.update', targetId: id },
    );
    return this.toResponse(media);
  }

  //COMMENT the row goes first, then the files: a failed file removal only leaves orphans
  async remove(id: string, { actorId, ip }: IMediaActor): Promise<void> {
    const media = await this.getOrThrow(id);

    try {
      await this.mediaRepository.delete(id, {
        actorId,
        ip,
        action: 'media.delete',
        targetId: id,
      });
    } catch (error) {
      //COMMENT every reference to media is onDelete: Restrict (collection cover, banner,
      //future tables), so the database itself says whether the media is in use
      if (isPrismaError(error, 'P2003')) {
        throw new ConflictException('The media is in use');
      }
      throw error;
    }

    await this.storage
      .remove(this.storedVariants(media).map(v => v.key))
      .catch((error: unknown) => {
        this.logger.warn(
          `Media ${id} deleted, its files stay in storage: ${String(error)}`,
        );
      });
  }

  private async getOrThrow(id: string): Promise<Media> {
    const media = await this.mediaRepository.findById(id);
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  //COMMENT Prisma types Json loosely; only the media pipeline writes this column
  private storedVariants(media: Media) {
    return media.variants as unknown as IStoredMediaVariant[];
  }

  //COMMENT public: the CMS collection responses embed media in the same shape
  toResponse(media: Media): MediaResponse {
    return {
      id: media.id,
      checksum: media.checksum,
      width: media.width,
      height: media.height,
      sizeBytes: media.sizeBytes,
      variants: this.storedVariants(media).map(variant => ({
        ...variant,
        publicUrl: this.storage.publicUrl(variant.key),
      })),
      blurDataUrl: media.blurDataUrl,
      alt: media.alt,
      originalName: media.originalName,
      focalX: media.focalX,
      focalY: media.focalY,
      objectPosition: toObjectPosition(media.focalX, media.focalY),
      //COMMENT the DTO checked the shape before it was stored
      cropData: media.cropData as unknown as CropDataResponse | null,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }
}
