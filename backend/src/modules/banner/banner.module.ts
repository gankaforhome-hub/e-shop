import { DatabaseModule } from '@database/database.module';
import { MediaModule } from '@modules/media/media.module';
import { RevalidationModule } from '@modules/revalidation/revalidation.module';
import { StaffModule } from '@modules/staff/staff.module';
import { Module } from '@nestjs/common';
import { AdminBannerController } from './admin-banner.controller';
import { AdminBannerService } from './admin-banner.service';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerRepository } from './repository/banner.repository';

@Module({
  //COMMENT StaffModule provides StaffAccessService for StaffGuard
  imports: [DatabaseModule, MediaModule, StaffModule, RevalidationModule],
  controllers: [BannerController, AdminBannerController],
  providers: [BannerRepository, BannerService, AdminBannerService],
})
export class BannerModule {}
