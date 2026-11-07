import { ROOT_CREDENTIAL_IDS, ROOT_USER_IDS } from '@common/constants';
import { parseEnvList } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';

@Injectable()
export class StaffAccessService {
  constructor(private readonly configService: ConfigService) {}

  isRootCredential(credentialId: string): boolean {
    return parseEnvList(
      this.configService.get<string>(ROOT_CREDENTIAL_IDS),
    ).includes(credentialId);
  }

  //COMMENT an approved, not revoked staff member in a CMS session confirmed with a key
  isActive({ aud, aal, staff }: IAuthUser): boolean {
    return (
      aud === E_AuthAudience.CMS &&
      aal >= 2 &&
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
