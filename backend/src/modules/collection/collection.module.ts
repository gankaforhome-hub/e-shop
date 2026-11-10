import { DatabaseModule } from '@database/database.module';
import { MediaModule } from '@modules/media/media.module';
import { RevalidationModule } from '@modules/revalidation/revalidation.module';
import { StaffModule } from '@modules/staff/staff.module';
import { Module } from '@nestjs/common';
import { AdminCollectionController } from './admin-collection.controller';
import { AdminCollectionService } from './admin-collection.service';
import { AdminSeasonController } from './admin-season.controller';
import { AdminSeasonService } from './admin-season.service';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { AdminCollectionRepository } from './repository/admin-collection.repository';
import { AdminSeasonRepository } from './repository/admin-season.repository';
import { CollectionRepository } from './repository/collection.repository';

@Module({
  //COMMENT StaffModule provides StaffAccessService for StaffGuard
  imports: [DatabaseModule, MediaModule, StaffModule, RevalidationModule],
  controllers: [
    CollectionController,
    AdminCollectionController,
    AdminSeasonController,
  ],
  providers: [
    CollectionRepository,
    CollectionService,
    AdminCollectionRepository,
    AdminCollectionService,
    AdminSeasonRepository,
    AdminSeasonService,
  ],
})
export class CollectionModule {}
