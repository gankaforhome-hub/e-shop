import {
  MEDIA_BUCKET,
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
} from '@common/constants';
import { DatabaseModule } from '@database/database.module';
import { RevalidationModule } from '@modules/revalidation/revalidation.module';
import { StaffModule } from '@modules/staff/staff.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MEDIA_STORAGE } from './interfaces';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './repository/media.repository';
import { createSupabaseMediaStorage } from './storage/supabase-media.storage';

@Module({
  //COMMENT StaffModule provides StaffAccessService for StaffGuard
  imports: [DatabaseModule, StaffModule, RevalidationModule],
  controllers: [MediaController],
  providers: [
    MediaRepository,
    MediaService,
    {
      provide: MEDIA_STORAGE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createSupabaseMediaStorage({
          url: config.getOrThrow<string>(SUPABASE_URL),
          secretKey: config.getOrThrow<string>(SUPABASE_SECRET_KEY),
          bucket: config.getOrThrow<string>(MEDIA_BUCKET),
        }),
    },
  ],
  exports: [MEDIA_STORAGE, MediaService],
})
export class MediaModule {}
