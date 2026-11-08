import { PrismaService } from '@database/prisma/prisma.service';
import { IAuditEntry } from '@modules/staff/repository/staff.repository';
import { Injectable } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';

@Injectable()
export class MediaRepository {
  constructor(private readonly db: PrismaService) {}

  findById(id: string): Promise<Media | null> {
    return this.db.media.findUnique({ where: { id } });
  }

  findByChecksum(checksum: string): Promise<Media | null> {
    return this.db.media.findUnique({ where: { checksum } });
  }

  async findPage(skip: number, take: number) {
    const [items, total] = await this.db.$transaction([
      this.db.media.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        skip,
        take,
      }),
      this.db.media.count(),
    ]);
    return { items, total };
  }

  async create(
    data: Prisma.MediaUncheckedCreateInput,
    audit: Omit<IAuditEntry, 'targetId'>,
  ): Promise<Media> {
    return this.db.$transaction(async tx => {
      const media = await tx.media.create({ data });
      await tx.auditLog.create({ data: { ...audit, targetId: media.id } });
      return media;
    });
  }

  async update(
    id: string,
    data: Prisma.MediaUpdateInput,
    audit: IAuditEntry,
  ): Promise<Media> {
    const [media] = await this.db.$transaction([
      this.db.media.update({ where: { id }, data }),
      this.db.auditLog.create({ data: audit }),
    ]);
    return media;
  }

  async delete(id: string, audit: IAuditEntry): Promise<void> {
    await this.db.$transaction([
      this.db.media.delete({ where: { id } }),
      this.db.auditLog.create({ data: audit }),
    ]);
  }
}
