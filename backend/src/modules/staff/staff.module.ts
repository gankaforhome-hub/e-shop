import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { StaffRepository } from './repository/staff.repository';
import { StaffAccessService } from './staff-access.service';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { WebAuthnService } from './webauthn.service';

//COMMENT depends on no other module, so auth and user can both import it
@Module({
  imports: [DatabaseModule],
  controllers: [StaffController],
  providers: [
    StaffRepository,
    StaffAccessService,
    StaffService,
    WebAuthnService,
  ],
  exports: [StaffRepository, StaffAccessService, WebAuthnService],
})
export class StaffModule {}
