import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { E_StaffRole, StaffAccount } from '@prisma/client';
import { StaffRepository } from './repository/staff.repository';

const ENROLLMENT_CODE_LIFETIME_MS = 60 * 60 * 1000;

export interface IStaffActionContext {
  actorId: string;
  ip?: string;
}

//COMMENT only the CLI creates root rows, and no route may change or remove one
@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  private async getManageableAccount(userId: string): Promise<StaffAccount> {
    const account = await this.staffRepository.findStaffAccount(userId);
    if (!account) {
      throw new NotFoundException();
    }
    if (account.role === E_StaffRole.ROOT) {
      throw new ForbiddenException();
    }
    return account;
  }

  async grant(
    userId: string,
    role: E_StaffRole,
    { actorId, ip }: IStaffActionContext,
  ): Promise<void> {
    const user = await this.staffRepository.findUserWithStaff(userId);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.staffAccount?.role === E_StaffRole.ROOT) {
      throw new ForbiddenException();
    }
    if (!user.emailVerifiedAt) {
      throw new BadRequestException('The email of the user is not verified');
    }

    await this.staffRepository.grant(userId, role, {
      actorId,
      action: 'staff.grant',
      targetId: userId,
      ip,
      meta: { role },
    });
  }

  //COMMENT shown once to the root admin, who hands it over outside of email
  async createEnrollmentCode(
    userId: string,
    { actorId, ip }: IStaffActionContext,
  ): Promise<string> {
    const account = await this.getManageableAccount(userId);
    if (account.revokedAt) {
      throw new BadRequestException('The access of the user is revoked');
    }

    return this.staffRepository.createEnrollmentCode(
      userId,
      ENROLLMENT_CODE_LIFETIME_MS,
      { actorId, action: 'staff.enrollment_code', targetId: userId, ip },
    );
  }

  async approve(
    userId: string,
    { actorId, ip }: IStaffActionContext,
  ): Promise<void> {
    const account = await this.getManageableAccount(userId);
    if (account.revokedAt) {
      throw new BadRequestException('The access of the user is revoked');
    }
    if ((await this.staffRepository.countCredentials(userId)) === 0) {
      throw new BadRequestException('The user has not registered a key yet');
    }

    await this.staffRepository.approve(userId, actorId, {
      actorId,
      action: 'staff.approve',
      targetId: userId,
      ip,
    });
  }

  async revoke(
    userId: string,
    { actorId, ip }: IStaffActionContext,
  ): Promise<void> {
    await this.getManageableAccount(userId);

    await this.staffRepository.revoke(userId, {
      actorId,
      action: 'staff.revoke',
      targetId: userId,
      ip,
    });
  }
}
