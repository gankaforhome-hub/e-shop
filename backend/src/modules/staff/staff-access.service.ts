import {
  ROOT_CREDENTIAL_IDS,
  ROOT_ENROLLMENT_CODE,
  ROOT_USER_IDS,
} from '@common/constants';
import { parseEnvList } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class StaffAccessService {
  constructor(private readonly configService: ConfigService) {}

  isRootCredential(credentialId: string): boolean {
    return parseEnvList(
      this.configService.get<string>(ROOT_CREDENTIAL_IDS),
    ).includes(credentialId);
  }

  //COMMENT the env code that lets a root add the first key; constant-time compare
  isRootEnrollmentCode(code: string | undefined): boolean {
    const expected = this.configService.get<string>(ROOT_ENROLLMENT_CODE);
    if (!expected || !code) {
      return false;
    }
    const a = Buffer.from(code);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  /**
   * A not revoked staff member in a CMS session. Keys are optional for staff: a user who added
   * one must have confirmed this session with it (aal 2). Root rights need a key, see isRoot.
   */
  isActive({ aud, aal, hasKey, staff }: IAuthUser): boolean {
    return (
      aud === E_AuthAudience.CMS &&
      !!staff &&
      !staff.revokedAt &&
      (!hasKey || aal >= 2)
    );
  }

  /**
   * A database row alone never makes a root admin, and neither does a mailbox: the user and
   * the key that confirmed the session must also be listed in the environment.
   */
  isRoot(user: IAuthUser): boolean {
    return (
      this.isActive(user) &&
      user.staff?.role === E_StaffRole.ROOT &&
      user.aal >= 2 &&
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
