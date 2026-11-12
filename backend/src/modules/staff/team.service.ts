import { normalizeEmail } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import { MailService } from '@modules/mail/mail.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { E_StaffRole, StaffAccount } from '@prisma/client';
import { StaffRepository } from './repository/staff.repository';
import {
  TeamMemberResponse,
  TeamMemberStatus,
} from './responses/team-member.response';
import { StaffAccessService } from './staff-access.service';
import { IStaffActionContext } from './staff.service';

const INVITE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Team management for admins in the CMS. An ADMIN manages the roles below it; only a real
 * root (key-confirmed, listed in env) may also invite or manage an ADMIN. ROOT rows are
 * never touched here, and nobody manages their own account.
 */
@Injectable()
export class TeamService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly staffAccess: StaffAccessService,
    private readonly mailService: MailService,
  ) {}

  private canAssign(actor: IAuthUser, role: E_StaffRole): boolean {
    if (role === E_StaffRole.ROOT) {
      return false;
    }
    return role !== E_StaffRole.ADMIN || this.staffAccess.isRoot(actor);
  }

  private canManage(
    actor: IAuthUser,
    { userId, role }: Pick<StaffAccount, 'userId' | 'role'>,
  ): boolean {
    return userId !== actor.id && this.canAssign(actor, role);
  }

  private async getManageableAccount(
    actor: IAuthUser,
    userId: string,
  ): Promise<StaffAccount> {
    const account = await this.staffRepository.findStaffAccount(userId);
    if (!account) {
      throw new NotFoundException();
    }
    if (!this.canManage(actor, account)) {
      throw new ForbiddenException();
    }
    return account;
  }

  async list(actor: IAuthUser): Promise<TeamMemberResponse[]> {
    const members = await this.staffRepository.listTeam();

    return members.map(member => {
      let status: TeamMemberStatus = 'active';
      if (member.revokedAt) {
        status = 'revoked';
      } else if (!member.hasPassword || !member.emailVerified) {
        status = 'invited';
      } else if (!member.approvedAt) {
        status = 'pending';
      }

      return {
        userId: member.userId,
        email: member.email,
        name: member.name,
        role: member.role,
        status,
        hasKey: member.hasKey,
        manageable: this.canManage(actor, member),
        createdAt: member.createdAt,
      };
    });
  }

  //COMMENT inviting again renews the link of an invited, pending or revoked member
  async invite(
    actor: IAuthUser,
    rawEmail: string,
    role: E_StaffRole,
    { ip }: Pick<IStaffActionContext, 'ip'>,
  ): Promise<void> {
    if (!this.canAssign(actor, role)) {
      throw new ForbiddenException('This role can not be assigned by you');
    }

    const email = normalizeEmail(rawEmail);
    const existing = await this.staffRepository.findUserByEmailWithStaff(email);
    const account = existing?.staffAccount;

    if (account) {
      if (!this.canManage(actor, account)) {
        throw new ForbiddenException();
      }
      const isActive =
        !account.revokedAt &&
        !!account.approvedAt &&
        existing.password !== null &&
        existing.emailVerifiedAt !== null;
      if (isActive) {
        throw new ConflictException('Already a staff member');
      }
    }

    const { token } = await this.staffRepository.invite(
      email,
      role,
      INVITE_LIFETIME_MS,
      { actorId: actor.id, action: 'staff.invite', ip, meta: { role } },
    );
    this.mailService.sendStaffInvite(email, token);
  }

  async changeRole(
    actor: IAuthUser,
    userId: string,
    role: E_StaffRole,
    { ip }: Pick<IStaffActionContext, 'ip'>,
  ): Promise<void> {
    const account = await this.getManageableAccount(actor, userId);
    if (!this.canAssign(actor, role)) {
      throw new ForbiddenException('This role can not be assigned by you');
    }
    if (account.revokedAt) {
      throw new BadRequestException('The access of the user is revoked');
    }

    await this.staffRepository.changeRole(userId, role, {
      actorId: actor.id,
      action: 'staff.change_role',
      targetId: userId,
      ip,
      meta: { from: account.role, to: role },
    });
  }

  //COMMENT only after the person has accepted the invite and added a key
  async approve(
    actor: IAuthUser,
    userId: string,
    { ip }: Pick<IStaffActionContext, 'ip'>,
  ): Promise<void> {
    const account = await this.getManageableAccount(actor, userId);
    if (account.revokedAt) {
      throw new BadRequestException('The access of the user is revoked');
    }
    if (account.approvedAt) {
      return;
    }
    if ((await this.staffRepository.countCredentials(userId)) === 0) {
      throw new BadRequestException('The user has not added a key yet');
    }

    await this.staffRepository.approve(userId, actor.id, {
      actorId: actor.id,
      action: 'staff.approve',
      targetId: userId,
      ip,
    });
  }

  async resetKeys(
    actor: IAuthUser,
    userId: string,
    { ip }: Pick<IStaffActionContext, 'ip'>,
  ): Promise<void> {
    await this.getManageableAccount(actor, userId);

    await this.staffRepository.resetKeys(userId, {
      actorId: actor.id,
      action: 'staff.reset_keys',
      targetId: userId,
      ip,
    });
  }

  async revoke(
    actor: IAuthUser,
    userId: string,
    { ip }: Pick<IStaffActionContext, 'ip'>,
  ): Promise<void> {
    const account = await this.getManageableAccount(actor, userId);
    if (account.revokedAt) {
      return;
    }

    await this.staffRepository.revoke(userId, {
      actorId: actor.id,
      action: 'staff.revoke',
      targetId: userId,
      ip,
    });
  }
}
