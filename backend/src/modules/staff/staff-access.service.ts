import {
  ROOT_CREDENTIAL_IDS,
  ROOT_USER_IDS,
  STAFF_KEY_REQUIRED,
} from '@common/constants';
import { parseEnvList } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';

@Injectable()
export class StaffAccessService implements OnModuleInit {
  private readonly logger = new Logger(StaffAccessService.name);

  //COMMENT development only: STAFF_KEY_REQUIRED=false lets a password session (aal 1) pass, until K.4
  private readonly keyRequired: boolean;

  constructor(private readonly configService: ConfigService) {
    this.keyRequired =
      this.configService.get<string>(STAFF_KEY_REQUIRED) !== 'false';
  }

  onModuleInit() {
    if (!this.keyRequired) {
      this.logger.warn('staff routes accept password-only CMS sessions');
    }
  }

  isRootCredential(credentialId: string): boolean {
    return parseEnvList(
      this.configService.get<string>(ROOT_CREDENTIAL_IDS),
    ).includes(credentialId);
  }

  //COMMENT an approved, not revoked staff member in a CMS session confirmed with a key
  isActive({ aud, aal, staff }: IAuthUser): boolean {
    return (
      aud === E_AuthAudience.CMS &&
      aal >= (this.keyRequired ? 2 : 1) &&
      !!staff?.approvedAt &&
      !staff.revokedAt
    );
  }

  /**
   * A database row alone never makes a root admin, and neither does a mailbox: the user and
   * the key that signed in must also be listed in the environment.
   */
  isRoot(user: IAuthUser): boolean {
    return (
      this.isActive(user) &&
      user.staff?.role === E_StaffRole.ROOT &&
      parseEnvList(this.configService.get<string>(ROOT_USER_IDS)).includes(
        user.id,
      ) &&
      !!user.credentialId &&
      this.isRootCredential(user.credentialId)
    );
  }

  //COMMENT ADMIN and a real root pass every role check
  hasRole(user: IAuthUser, roles: E_StaffRole[]): boolean {
    if (!this.isActive(user) || !user.staff) {
      return false;
    }
    const { role } = user.staff;

    if (role === E_StaffRole.ROOT) {
      return this.isRoot(user);
    }
    return role === E_StaffRole.ADMIN || roles.includes(role);
  }
}
