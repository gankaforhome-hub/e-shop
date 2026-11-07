import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { PasswordService } from '@modules/password/password.service';
import { StaffModule } from '@modules/staff/staff.module';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, CacheModule.register(), StaffModule],
  controllers: [UserController],
  providers: [UserRepository, UserService, PasswordService, Logger],
  exports: [UserService, PasswordService],
})
export class UserModule {}
