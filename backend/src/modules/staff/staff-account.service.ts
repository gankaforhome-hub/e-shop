import { normalizeEmail } from '@common/utils';
import { IAuthUser } from '@modules/auth/interfaces';
import { MailService } from '@modules/mail/mail.service';
import { PasswordService } from '@modules/password/password.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { E_StaffTokenPurpose } from '@prisma/client';
import { StaffRepository } from './repository/staff.repository';

const PASSWORD_RESET_LIFETIME_MS = 30 * 60 * 1000;
const INVALID_TOKEN_MESSAGE = 'Invalid or expired token';

/**
 * The staff member's own account in the CMS: accepting the invitation, password reset and
 * change. Separate from customer accounts; links always open the CMS.
 */
@Injectable()
export class StaffAccountService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly passwordService: PasswordService,
    private readonly mailService: MailService,
  ) {}

  /**
   * The invitation link proves the mailbox, so it also confirms the email. Returns the email,
   * so the CMS signs the person in with the new password at once.
   */
  async acceptInvite(token: string, password: string): Promise<string> {
    return this.setPasswordWithLink(
      token,
      password,
      E_StaffTokenPurpose.INVITE,
    );
  }

  //COMMENT the same answer for unknown and revoked addresses
  async forgotPassword(rawEmail: string): Promise<void> {
    const staff = await this.staffRepository.findStaffUserByEmail(
      normalizeEmail(rawEmail),
    );
    if (!staff || staff.revokedAt || !staff.emailVerifiedAt) {
      return;
    }

    const token = await this.staffRepository.createToken(
      staff.id,
      E_StaffTokenPurpose.PASSWORD_RESET,
      PASSWORD_RESET_LIFETIME_MS,
    );
    this.mailService.sendPasswordReset(staff.email, token, 'cms');
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const email = await this.setPasswordWithLink(
      token,
      password,
      E_StaffTokenPurpose.PASSWORD_RESET,
    );
    this.mailService.sendPasswordChanged(email);
  }

  async changePassword(
    actor: IAuthUser,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const staff = await this.staffRepository.findStaffUser(actor.id);
    const isPasswordValid = await this.passwordService.isPasswordValid(
      currentPassword,
      staff?.password,
    );
    if (!staff || !isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    await this.staffRepository.changePassword(
      staff.id,
      await this.passwordService.getHashPassword(newPassword),
      actor.sid,
    );
    this.mailService.sendPasswordChanged(staff.email);
  }

  private async setPasswordWithLink(
    token: string,
    password: string,
    purpose: E_StaffTokenPurpose,
  ): Promise<string> {
    const staffToken = await this.staffRepository.findToken(token, purpose);
    const staff =
      staffToken &&
      (await this.staffRepository.findStaffUser(staffToken.userId));
    if (!staffToken || !staff || staff.revokedAt) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isCompleted = await this.staffRepository.setPasswordWithToken(
      staffToken,
      await this.passwordService.getHashPassword(password),
    );
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
    return staff.email;
  }
}
