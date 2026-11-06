import { normalizeEmail } from '@common/utils';
import { MailService } from '@modules/mail/mail.service';
import { PasswordService } from '@modules/password/password.service';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  ConflictException,
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
  ) {}

  private async sendEmailVerification({ id, email }: User): Promise<void> {
    const token = await this.authRepository.createOneTimeToken(
      id,
      E_OneTimeTokenPurpose.EMAIL_VERIFICATION,
      EMAIL_VERIFICATION_LIFETIME_MS,
    );
    this.mailService.sendEmailVerification(email, token);
  }

  //COMMENT the caller gets the same answer either way, so sign-up does not reveal existing accounts
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const existing = await this.userService.findOneByEmail(signUpDto.email);

    if (existing) {
      //COMMENT the same work as a real sign-up, so the timing does not reveal it either
      await this.passwordService.getHashPassword(signUpDto.password);
      this.mailService.sendAccountExists(existing.email);
      return;
    }

    const user = await this.userService.create(signUpDto);
    if (user) {
      await this.sendEmailVerification(user);
    }
  }

  async resendVerification({ email }: EmailDto): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (user && !user.emailVerifiedAt) {
      await this.sendEmailVerification(user);
    }
  }

  /**
   * The password is required: someone could have signed up with this address before its
   * owner, and a click on the link must not make that stranger's password valid.
   * Such an owner uses the password reset instead, which replaces the password.
   */
  async verifyEmail({ token, password }: VerifyEmailDto): Promise<void> {
    const oneTimeToken = await this.authRepository.findOneTimeToken(
      token,
      E_OneTimeTokenPurpose.EMAIL_VERIFICATION,
    );
    const user =
      oneTimeToken && (await this.userService.findById(oneTimeToken.userId));

    if (!oneTimeToken || !user) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }

    const isPasswordValid = await this.passwordService.isPasswordValid(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    const isCompleted =
      await this.authRepository.completeEmailVerification(oneTimeToken);
    if (!isCompleted) {
      throw new BadRequestException(INVALID_TOKEN_MESSAGE);
    }
    await this.userService.clearCache(user.id);
  }

  async forgotPassword({ email }: EmailDto): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return;
    }

    const token = await this.authRepository.createOneTimeToken(
      user.id,
      E_OneTimeTokenPurpose.PASSWORD_RESET,
      PASSWORD_RESET_LIFETIME_MS,
    );
    this.mailService.sendPasswordReset(user.email, token);
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
