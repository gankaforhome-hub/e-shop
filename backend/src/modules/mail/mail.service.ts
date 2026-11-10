import { FRONTEND_URL } from '@common/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailMessage, IMailTransport, MAIL_TRANSPORT } from './interfaces';

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

  //COMMENT the token stays in the fragment, so it never reaches server logs or a Referer header
  private buildLink(path: string, token: string): string {
    const baseUrl = this.configService.get<string>(
      FRONTEND_URL,
      'http://localhost:3000',
    );
    return `${new URL(path, baseUrl).href}#token=${token}`;
  }

  sendEmailVerification(to: string, token: string): void {
    this.send({
      to,
      subject: 'Confirm your email',
      text: `Open this link to confirm your email:\n${this.buildLink('/verify-email', token)}\n\nThe link is valid for 24 hours. If you did not sign up, ignore this message.`,
    });
  }

  sendStaffInvite(to: string, token: string): void {
    this.send({
      to,
      subject: 'You are invited to Ganka CMS',
      text: `You were given access to the Ganka for Home admin panel. Open this link to set your password:\n${this.buildLink('/accept-invite', token)}\n\nThe link is valid for 7 days. If you did not expect it, ignore this message.`,
    });
  }

  sendAccountExists(to: string): void {
    this.send({
      to,
      subject: 'You already have an account',
      text: 'Someone tried to sign up with this email, but it already has an account. If it was you, sign in or reset your password. Otherwise, ignore this message.',
    });
  }

  sendPasswordReset(to: string, token: string): void {
    this.send({
      to,
      subject: 'Reset your password',
      text: `Open this link to set a new password:\n${this.buildLink('/reset-password', token)}\n\nThe link is valid for 30 minutes. If you did not request it, ignore this message.`,
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
      text: `A change of your account email was requested. It takes effect once both the old and the new address confirm it. Open this link to confirm:\n${this.buildLink('/confirm-email-change', token)}\n\nThe link is valid for 1 hour. If you did not request it, ignore this message and change your password.`,
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
