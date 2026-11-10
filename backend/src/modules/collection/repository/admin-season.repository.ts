import { PrismaService } from '@database/prisma/prisma.service';
import { IAuditEntry } from '@modules/staff/repository/staff.repository';
import { Injectable } from '@nestjs/common';
import { E_Locale, Prisma } from '@prisma/client';

const ADMIN_SEASON_INCLUDE = {
  // Enum order: uk first
  translations: { orderBy: { languageCode: 'asc' } },
  _count: { select: { collections: true } },
} satisfies Prisma.SeasonInclude;

export type AdminSeason = Prisma.SeasonGetPayload<{
  include: typeof ADMIN_SEASON_INCLUDE;
}>;

export type SeasonLabel = { languageCode: E_Locale; label: string };

@Injectable()
export class AdminSeasonRepository {
  constructor(private readonly db: PrismaService) {}

  findAll(): Promise<AdminSeason[]> {
    return this.db.season.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      include: ADMIN_SEASON_INCLUDE,
    });
  }

  findBySlug(slug: string): Promise<AdminSeason | null> {
    return this.db.season.findUnique({
      where: { slug },
      include: ADMIN_SEASON_INCLUDE,
    });
  }

  async create(
    slug: string,
    sortOrder: number,
    labels: SeasonLabel[],
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      this.db.season.create({
        data: { slug, sortOrder, translations: { create: labels } },
      }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  async update(
    slug: string,
    sortOrder: number | undefined,
    labels: SeasonLabel[],
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction([
      ...(sortOrder === undefined
        ? []
        : [this.db.season.update({ where: { slug }, data: { sortOrder } })]),
      ...labels.map(({ languageCode, label }) =>
        this.db.seasonTranslation.upsert({
          where: {
            seasonSlug_languageCode: { seasonSlug: slug, languageCode },
          },
          create: { seasonSlug: slug, languageCode, label },
          update: { label },
        }),
      ),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  async delete(slug: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.season.delete({ where: { slug } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }
}
