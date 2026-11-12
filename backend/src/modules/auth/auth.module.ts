import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AccountService } from './account.service';
import { GoogleAuthService } from './google-auth.service';
import { TurnstileService } from './turnstile.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CmsAuthController } from './cms-auth.controller';

import { jwtModuleAsyncOptions } from '@config';

import { CustomerModule } from '@modules/customer/customer.module';
import { CookieModule } from '@modules/cookie/cookie.module';
import { MailModule } from '@modules/mail/mail.module';
import { StaffModule } from '@modules/staff/staff.module';
import { DatabaseModule } from '@database/database.module';

import { AuthRepository } from './repository/auth.repository';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';

@Module({
  controllers: [AuthController, CmsAuthController],
  providers: [
    AuthService,
    AccountService,
    TurnstileService,
    GoogleAuthService,
    AuthRepository,
    ...STRATEGIES,
    ...GUARDS,
  ],
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule,
    CookieModule,
    MailModule,
    StaffModule,
    JwtModule.registerAsync(jwtModuleAsyncOptions()),
    CustomerModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
