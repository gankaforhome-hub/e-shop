import { PrismaService } from '@database/prisma/prisma.service';
import { IAuditEntry } from '@modules/staff/repository/staff.repository';
import { Injectable } from '@nestjs/common';
import { E_BannerLinkType, E_Locale, Prisma } from '@prisma/client';

const collectionTitles = {
  select: { languageCode: true, title: true },
  orderBy: { languageCode: 'asc' },
} satisfies Prisma.CollectionTranslationFindManyArgs;

const ADMIN_INCLUDE = {
  translations: { orderBy: { languageCode: 'asc' } },
  image: true,
  collection: {
    select: {
      id: true,
      slug: true,
      isActive: true,
      translations: collectionTitles,
    },
  },
} satisfies Prisma.BannerInclude;

export type AdminBanner = Prisma.BannerGetPayload<{
  include: typeof ADMIN_INCLUDE;
}>;

const publicInclude = (locales: E_Locale[]) =>
  ({
    translations: { where: { languageCode: { in: locales } } },
    image: true,
    collection: {
      select: {
        slug: true,
        translations: {
          where: { languageCode: { in: locales } },
          select: { languageCode: true, title: true },
        },
      },
    },
  }) satisfies Prisma.BannerInclude;

export type PublicBanner = Prisma.BannerGetPayload<{
  include: ReturnType<typeof publicInclude>;
}>;

export type BannerData = {
  linkType: E_BannerLinkType;
  collectionId: string | null;
  url: string | null;
  imageId: string;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
};

export type BannerText = {
  languageCode: E_Locale;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
};

const ORDER = [
  { sortOrder: 'asc' },
  { createdAt: 'asc' },
] satisfies Prisma.BannerOrderByWithRelationInput[];

@Injectable()
export class BannerRepository {
  constructor(private readonly db: PrismaService) {}

  /** On the storefront now: switched on, inside its dates, a linked collection visible. */
  findLive(locales: E_Locale[], now: Date): Promise<PublicBanner[]> {
    return this.db.banner.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
          {
            OR: [
              { linkType: E_BannerLinkType.URL },
              { collection: { isActive: true } },
            ],
          },
        ],
      },
      orderBy: ORDER,
      include: publicInclude(locales),
    });
  }

  findAll(): Promise<AdminBanner[]> {
    return this.db.banner.findMany({ orderBy: ORDER, include: ADMIN_INCLUDE });
  }

  findById(id: string): Promise<AdminBanner | null> {
    return this.db.banner.findUnique({ where: { id }, include: ADMIN_INCLUDE });
  }

  async mediaExists(id: string): Promise<boolean> {
    return (await this.db.media.count({ where: { id } })) > 0;
  }

  async collectionExists(id: string): Promise<boolean> {
    return (await this.db.collection.count({ where: { id } })) > 0;
  }

  findLinkTargets() {
    return this.db.collection.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      select: {
        id: true,
        slug: true,
        isActive: true,
        translations: collectionTitles,
      },
    });
  }

  countAll(): Promise<number> {
    return this.db.banner.count();
  }

  countByIds(ids: string[]): Promise<number> {
    return this.db.banner.count({ where: { id: { in: ids } } });
  }

  async create(
    data: BannerData,
    texts: BannerText[],
    audit: Omit<IAuditEntry, 'targetId'>,
  ): Promise<string> {
    return this.db.$transaction(async tx => {
      // A new slide goes last
      const { _max } = await tx.banner.aggregate({ _max: { sortOrder: true } });
      const { id } = await tx.banner.create({
        data: {
          ...data,
          sortOrder: (_max.sortOrder ?? 0) + 1,
          translations: { create: texts },
        },
        select: { id: true },
      });
      await tx.auditLog.create({ data: { ...audit, targetId: id } });
      return id;
    });
  }

  async update(
    id: string,
    data: Partial<BannerData>,
    texts: BannerText[],
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.banner.update({ where: { id }, data }),
      ...texts.map(({ languageCode, ...fields }) =>
        this.db.bannerTranslation.upsert({
          where: { bannerId_languageCode: { bannerId: id, languageCode } },
          create: { bannerId: id, languageCode, ...fields },
          update: fields,
        }),
      ),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  // sortOrder = position in the list, 1-based
  async setOrder(ids: string[], audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      ...ids.map((id, index) =>
        this.db.banner.update({
          where: { id },
          data: { sortOrder: index + 1 },
        }),
      ),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  async delete(id: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.banner.delete({ where: { id } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }
}
