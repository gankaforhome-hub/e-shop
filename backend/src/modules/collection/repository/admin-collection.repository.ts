import { PrismaService } from '@database/prisma/prisma.service';
import { IAuditEntry } from '@modules/staff/repository/staff.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

const ADMIN_INCLUDE = {
  // Enum order: uk first
  translations: { orderBy: { languageCode: 'asc' } },
  coverImage: true,
  _count: { select: { banners: true } },
} satisfies Prisma.CollectionInclude;

export type AdminCollection = Prisma.CollectionGetPayload<{
  include: typeof ADMIN_INCLUDE;
}>;

export type CollectionCreateData = Omit<
  Prisma.CollectionUncheckedCreateInput,
  'id' | 'translations' | 'createdAt' | 'updatedAt'
>;

export type CollectionUpdateData = Omit<
  Prisma.CollectionUncheckedUpdateInput,
  'id' | 'translations' | 'createdAt' | 'updatedAt'
>;

export type TranslationData = Omit<
  Prisma.CollectionTranslationUncheckedCreateInput,
  'collectionId'
>;

@Injectable()
export class AdminCollectionRepository {
  constructor(private readonly db: PrismaService) {}

  findAll(): Promise<AdminCollection[]> {
    return this.db.collection.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      include: ADMIN_INCLUDE,
    });
  }

  findById(id: string): Promise<AdminCollection | null> {
    return this.db.collection.findUnique({
      where: { id },
      include: ADMIN_INCLUDE,
    });
  }

  // Ids among the given ones that exist, for validating references
  async existingMediaIds(ids: string[]): Promise<Set<string>> {
    const rows = await this.db.media.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    return new Set(rows.map(row => row.id));
  }

  async seasonExists(slug: string): Promise<boolean> {
    return (await this.db.season.count({ where: { slug } })) > 0;
  }

  async slugTaken(slug: string, exceptId?: string): Promise<boolean> {
    const count = await this.db.collection.count({
      where: { slug, ...(exceptId && { id: { not: exceptId } }) },
    });
    return count > 0;
  }

  countAll(): Promise<number> {
    return this.db.collection.count();
  }

  async countByIds(ids: string[]): Promise<number> {
    return this.db.collection.count({ where: { id: { in: ids } } });
  }

  async create(
    data: CollectionCreateData,
    translations: TranslationData[],
    audit: Omit<IAuditEntry, 'targetId'>,
  ): Promise<string> {
    return this.db.$transaction(async tx => {
      const { id } = await tx.collection.create({
        data: { ...data, translations: { create: translations } },
        select: { id: true },
      });
      await tx.auditLog.create({ data: { ...audit, targetId: id } });
      return id;
    });
  }

  async update(
    id: string,
    data: CollectionUpdateData,
    translations: TranslationData[],
    audit: IAuditEntry,
  ): Promise<void> {
    await this.db.$transaction(async tx => {
      await tx.collection.update({ where: { id }, data });
      for (const translation of translations) {
        const { languageCode, ...fields } = translation;
        await tx.collectionTranslation.upsert({
          where: {
            collectionId_languageCode: { collectionId: id, languageCode },
          },
          create: { collectionId: id, ...translation },
          update: fields,
        });
      }
      await tx.auditLog.create({ data: audit });
    });
  }

  // sortOrder = position in the list, 1-based
  async setOrder(ids: string[], audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      ...ids.map((id, index) =>
        this.db.collection.update({
          where: { id },
          data: { sortOrder: index + 1 },
        }),
      ),
      this.db.auditLog.create({ data: audit }),
    ]);
  }

  async delete(id: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.collection.delete({ where: { id } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }
}
