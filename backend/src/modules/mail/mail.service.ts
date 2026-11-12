import { CMS_URL, FRONTEND_URL } from '@common/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailMessage, IMailTransport, MAIL_TRANSPORT } from './interfaces';

export type LinkApp = 'storefront' | 'cms';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(MAIL_TRANSPORT) private readonly transport: IMailTransport,
    private readonly configService: ConfigService,
  ) {}

  //COMMENT not awaited by callers: neither the provider's latency nor its failure may
  //reveal whether an account exists
  private send(message: IMailMessage): void {
    this.transport.send(message).catch((err: unknown) => {
      this.logger.error(`Failed to send "${message.subject}"`, err);
    });
  }

  //COMMENT customer links open the storefront, staff links the CMS (without CMS_URL: FRONTEND_URL)
  private getBaseUrl(app: LinkApp): string {
    const storefront = this.configService.get<string>(FRONTEND_URL);
    if (app === 'storefront') {
      return storefront ?? 'http://localhost:3000';
    }
    return (
      this.configService.get<string>(CMS_URL) ??
      storefront ??
      'http://localhost:3030'
    );
  }

  //COMMENT the token stays in the fragment, so it never reaches server logs or a Referer header
  private buildLink(path: string, token: string, app: LinkApp): string {
    return `${new URL(path, this.getBaseUrl(app)).href}#token=${token}`;
  }

  //COMMENT soft verification: shopping never waits for it; the link works only signed in to that account
  sendEmailVerification(to: string, token: string): void {
    this.send({
      to,
      subject: 'Confirm your email at Ganka for Home',
      text: `Open this link and sign in to your account to confirm your email:\n${this.buildLink('/verify-email', token, 'storefront')}\n\nThe link is valid for 24 hours. If you did not create an account with this address, ignore this message: nothing is confirmed without signing in, and you can claim the address any time with "Forgot password".`,
    });
  }

  sendStaffInvite(to: string, token: string): void {
    this.send({
      to,
      subject: 'You are invited to Ganka CMS',
      text: `You were given access to the Ganka for Home admin panel. Open this link to set your password:\n${this.buildLink('/accept-invite', token, 'cms')}\n\nThe link is valid for 7 days. If you did not expect it, ignore this message.`,
    });
  }

  sendAccountExists(to: string): void {
    this.send({
      to,
      subject: 'You already have an account',
      text: 'Someone tried to sign up with this email, but it already has an account. If it was you, sign in or reset your password. Otherwise, ignore this message.',
    });
  }

  sendPasswordReset(to: string, token: string, app: LinkApp): void {
    this.send({
      to,
      subject: 'Reset your password',
      text: `Open this link to set a new password:\n${this.buildLink('/reset-password', token, app)}\n\nThe link is valid for 30 minutes. If you did not request it, ignore this message.`,
    });
  }

  sendPasswordChanged(to: string): void {
    this.send({
      to,
      subject: 'Your password was changed',
      text: 'The password of your account was changed. If it was not you, reset your password right away.',
    });
  }

  sendEmailChangeConfirmation(to: string, token: string): void {
    this.send({
      to,
      subject: 'Confirm your email change',
      text: `A change of your account email was requested. It takes effect once both the old and the new address confirm it. Open this link to confirm:\n${this.buildLink('/confirm-email-change', token, 'storefront')}\n\nThe link is valid for 1 hour. If you did not request it, ignore this message and change your password.`,
    });
  }

  sendEmailChangeRefused(to: string): void {
    this.send({
      to,
      subject: 'Email change attempt',
      text: 'Someone tried to change their account email to this address, but it already has an account. No changes were made.',
    });
  }

  sendEmailChanged(to: string, newEmail: string): void {
    this.send({
      to,
      subject: 'Your account email was changed',
      text: `The email of your account was changed to ${newEmail}. If it was not you, contact support right away.`,
    });
  }
}
