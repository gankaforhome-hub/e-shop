import { TERMS_VERSION } from '@common/constants';
import { normalizeEmail } from '@common/utils';
import { MailService } from '@modules/mail/mail.service';
import { PasswordService } from '@modules/password/password.service';
import { StaffRepository } from '@modules/staff/repository/staff.repository';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { E_OneTimeTokenPurpose, User } from '@prisma/client';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmEmailChangeDto,
  EmailDto,
  ResetPasswordDto,
  SignUpDto,
  VerifyEmailDto,
} from './dto';
import { IAuthUser } from './interfaces';
import { AuthRepository } from './repository/auth.repository';
import { TurnstileService } from './turnstile.service';

const MINUTE_MS = 60 * 1000;
const EMAIL_VERIFICATION_LIFETIME_MS = 24 * 60 * MINUTE_MS;
const PASSWORD_RESET_LIFETIME_MS = 30 * MINUTE_MS;
const EMAIL_CHANGE_LIFETIME_MS = 60 * MINUTE_MS;

const INVALID_TOKEN_MESSAGE = 'Invalid or expired token';

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    private readonly staffRepository: StaffRepository,
    private readonly turnstile: TurnstileService,
  ) {}

  private async sendEmailVerification({ id, email }: User): Promise<void> {
    const token = await this.authRepository.createOneTimeToken(
      id,
      E_OneTimeTokenPurpose.EMAIL_VERIFICATION,
      EMAIL_VERIFICATION_LIFETIME_MS,
    );
    this.mailService.sendEmailVerification(email, token);
  }

  /**
   * The caller gets the same answer either way, so sign-up reveals neither existing emails nor
   * taken phones. A new account works at once; the welcome mail only asks to confirm the email.
   */
  async signUp(
    {
      firstName,
      lastName,
      email,
      password,
      phone,
      marketingConsent,
      turnstileToken,
    }: SignUpDto,
    ip?: string,
  ): Promise<void> {
    await this.turnstile.assertHuman(turnstileToken, ip);

    const existing = await this.userService.findOneByEmail(email);
    const isPhoneTaken = !!phone && (await this.userService.isPhoneTaken(phone));

    if (existing || isPhoneTaken) {
      //COMMENT the same work as a real sign-up, so the timing does not reveal it either
      await this.passwordService.getHashPassword(password);
      if (existing) {
        this.mailService.sendAccountExists(existing.email);
      }
      return;
    }

    //COMMENT the DTO only passes with acceptTerms === true; the version proves what was accepted
    const now = new Date();
    const user = await this.userService.create({
      email,
      password,
      phone,
      firstName,
      lastName,
      termsAcceptedAt: now,
      termsVersion: TERMS_VERSION,
      marketingConsentAt: marketingConsent ? now : null,
    });
    if (user) {
      await this.sendEmailVerification(user);
    }
  }

  //COMMENT only to the signed-in customer's own address, so nobody can mail links to strangers
  async resendVerification(actor: IAuthUser): Promise<void> {
    const user = await this.userService.findById(actor.id);
    if (user && !user.emailVerifiedAt) {
      await this.sendEmailVerification(user);
    }
  }

  /**
   * Needs the session of the very account the link was sent for. Someone may sign up with a
   * stranger's address; the stranger gets the link, but a click without that account's session
   * confirms nothing. The real owner takes the address back with a password reset, which proves
   * the mailbox, marks it verified and ends every session.
   */
  async verifyEmail(actor: IAuthUser, { token }: VerifyEmailDto): Promise<void> {
    const oneTimeToken = await this.authRepository.findOneTimeToken(
      token,
      E_OneTimeTokenPurpose.EMAIL_VERIFICATION,
    );
    const user =
      oneTimeToken && (await this.userService.findById(oneTimeToken.userId));

    if (!oneTimeToken || !user || user.id !== actor.id) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isCompleted =
      await this.authRepository.completeEmailVerification(oneTimeToken);
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
    await this.userService.clearCache(user.id);
  }

  //COMMENT a staff member gets the CMS reset page, a customer the storefront one
  async forgotPassword(
    { email, turnstileToken }: EmailDto,
    ip?: string,
  ): Promise<void> {
    await this.turnstile.assertHuman(turnstileToken, ip);

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return;
    }

    const token = await this.authRepository.createOneTimeToken(
      user.id,
      E_OneTimeTokenPurpose.PASSWORD_RESET,
      PASSWORD_RESET_LIFETIME_MS,
    );
    const staff = await this.staffRepository.findStaffAccount(user.id);
    this.mailService.sendPasswordReset(
      user.email,
      token,
      staff && !staff.revokedAt ? 'cms' : 'storefront',
    );
  }

  async resetPassword({ token, password }: ResetPasswordDto): Promise<void> {
    const oneTimeToken = await this.authRepository.findOneTimeToken(
      token,
      E_OneTimeTokenPurpose.PASSWORD_RESET,
    );
    const user =
      oneTimeToken && (await this.userService.findById(oneTimeToken.userId));

    if (!oneTimeToken || !user) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isCompleted = await this.authRepository.completePasswordReset(
      oneTimeToken,
      await this.passwordService.getHashPassword(password),
    );
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    await this.userService.clearCache(user.id);
    this.mailService.sendPasswordChanged(user.email);
  }

  /**
   * The same as a password reset: the link proves the mailbox, so it also confirms the email.
   * Returns the email, so the CMS can sign the person in with the new password at once.
   */
  async acceptStaffInvite({
    token,
    password,
  }: ResetPasswordDto): Promise<string> {
    const oneTimeToken = await this.authRepository.findOneTimeToken(
      token,
      E_OneTimeTokenPurpose.STAFF_INVITE,
    );
    const user =
      oneTimeToken && (await this.userService.findById(oneTimeToken.userId));

    if (!oneTimeToken || !user) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isCompleted = await this.authRepository.completePasswordReset(
      oneTimeToken,
      await this.passwordService.getHashPassword(password),
    );
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
    await this.userService.clearCache(user.id);
    return user.email;
  }

  async changePassword(
    actor: IAuthUser,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<void> {
    await this.assertPassword(actor.id, currentPassword);

    await this.authRepository.changePassword(
      actor.id,
      await this.passwordService.getHashPassword(newPassword),
      actor.sid,
    );
    this.mailService.sendPasswordChanged(actor.email);
  }

  /**
   * Both addresses get a token. When the new one is taken, its owner gets a notice instead,
   * and the old address still gets its token, so the requester can't tell the difference.
   */
  async changeEmail(
    actor: IAuthUser,
    { newEmail, password }: ChangeEmailDto,
  ): Promise<void> {
    //COMMENT a staff email must not be movable to a mailbox an attacker controls
    if (actor.staff && !actor.staff.revokedAt) {
      throw new ForbiddenException(
        'Staff emails can only be changed by a root admin',
      );
    }

    await this.assertPassword(actor.id, password);

    const email = normalizeEmail(newEmail);
    if (email === actor.email) {
      throw new BadRequestException('This is already your email');
    }

    await this.authRepository.deleteEmailChangeTokens(actor.id);

    const oldAddressToken = await this.authRepository.createOneTimeToken(
      actor.id,
      E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD,
      EMAIL_CHANGE_LIFETIME_MS,
      email,
    );
    this.mailService.sendEmailChangeConfirmation(actor.email, oldAddressToken);

    if (await this.userService.findOneByEmail(email)) {
      this.mailService.sendEmailChangeRefused(email);
      return;
    }

    const newAddressToken = await this.authRepository.createOneTimeToken(
      actor.id,
      E_OneTimeTokenPurpose.EMAIL_CHANGE_NEW,
      EMAIL_CHANGE_LIFETIME_MS,
      email,
    );
    this.mailService.sendEmailChangeConfirmation(email, newAddressToken);
  }

  //COMMENT true when the email was changed, false while the other address has not confirmed
  async confirmEmailChange({ token }: ConfirmEmailChangeDto): Promise<boolean> {
    const oneTimeToken =
      (await this.authRepository.findOneTimeToken(
        token,
        E_OneTimeTokenPurpose.EMAIL_CHANGE_OLD,
      )) ??
      (await this.authRepository.findOneTimeToken(
        token,
        E_OneTimeTokenPurpose.EMAIL_CHANGE_NEW,
      ));
    const user =
      oneTimeToken && (await this.userService.findById(oneTimeToken.userId));

    if (!oneTimeToken?.newEmail || !user) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const result = await this.authRepository.confirmEmailChange(oneTimeToken);

    switch (result) {
      case 'pending':
        return false;
      case 'applied':
        await this.userService.clearCache(user.id);
        this.mailService.sendEmailChanged(user.email, oneTimeToken.newEmail);
        return true;
      case 'conflict':
        throw new ConflictException('Unable to change the email');
      case 'invalid':
        throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
  }

  private async assertPassword(userId: string, password: string) {
    const user = await this.userService.findById(userId);
    const isPasswordValid = await this.passwordService.isPasswordValid(
      password,
      user?.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }
  }
}
