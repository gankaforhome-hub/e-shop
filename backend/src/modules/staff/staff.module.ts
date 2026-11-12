import { DatabaseModule } from '@database/database.module';
import { MailModule } from '@modules/mail/mail.module';
import { PasswordService } from '@modules/password/password.service';
import { Module } from '@nestjs/common';
import { StaffRepository } from './repository/staff.repository';
import { StaffAccessService } from './staff-access.service';
import { StaffAccountService } from './staff-account.service';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { WebAuthnService } from './webauthn.service';

//COMMENT depends only on leaf modules (database, mail), so auth and user can both import it
@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [StaffController, TeamController],
  providers: [
    StaffRepository,
    StaffAccessService,
    StaffAccountService,
    StaffService,
    PasswordService,
    TeamService,
    WebAuthnService,
  ],
  exports: [
    StaffRepository,
    StaffAccessService,
    StaffAccountService,
    WebAuthnService,
  ],
})
export class StaffModule {}
