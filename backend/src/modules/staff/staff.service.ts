import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { E_StaffRole, StaffUser } from '@prisma/client';
import { StaffRepository } from './repository/staff.repository';

export interface IStaffActionContext {
  actorId: string;
  ip?: string;
}

//COMMENT only the CLI creates root rows, and no route may change or remove one
@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  private async getManageableAccount(userId: string): Promise<StaffUser> {
    const account = await this.staffRepository.findStaffUser(userId);
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
    const user = await this.staffRepository.findStaffUser(userId);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.role === E_StaffRole.ROOT) {
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
