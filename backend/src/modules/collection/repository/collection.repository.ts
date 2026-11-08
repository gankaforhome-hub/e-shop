import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { E_Locale, Prisma } from '@prisma/client';

// Loads only the requested language and the uk fallback
const withTranslations = (locales: E_Locale[]) =>
  ({
    translations: { where: { languageCode: { in: locales } } },
    season: {
      include: { translations: { where: { languageCode: { in: locales } } } },
    },
    coverImage: true,
    bannerImage: true,
  }) satisfies Prisma.CollectionInclude;

export type CollectionWithRelations = Prisma.CollectionGetPayload<{
  include: ReturnType<typeof withTranslations>;
}>;

export type SeasonWithTranslations = Prisma.SeasonGetPayload<{
  include: { translations: true };
}>;

@Injectable()
export class CollectionRepository {
  constructor(private readonly db: PrismaService) {}

  findActive(locales: E_Locale[]): Promise<CollectionWithRelations[]> {
    return this.db.collection.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      include: withTranslations(locales),
    });
  }

  //COMMENT the banner image is guaranteed by a CHECK on in_banner
  findInBanner(locales: E_Locale[]): Promise<CollectionWithRelations[]> {
    return this.db.collection.findMany({
      where: { isActive: true, inBanner: true },
      orderBy: [
        { bannerSortOrder: 'asc' },
        { sortOrder: 'asc' },
        { slug: 'asc' },
      ],
      include: withTranslations(locales),
    });
  }

  findActiveBySlug(
    slug: string,
    locales: E_Locale[],
  ): Promise<CollectionWithRelations | null> {
    return this.db.collection.findFirst({
      where: { slug, isActive: true },
      include: withTranslations(locales),
    });
  }

  findSeasons(locales: E_Locale[]): Promise<SeasonWithTranslations[]> {
    return this.db.season.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      include: { translations: { where: { languageCode: { in: locales } } } },
    });
  }
}
