import { TURNSTILE_SECRET_KEY } from '@common/constants';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Cloudflare Turnstile against sign-up and reset-link bots, instead of a mandatory email
 * verification. Off while TURNSTILE_SECRET_KEY is empty, so nothing changes until keys exist.
 */
@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);

  constructor(private readonly configService: ConfigService) {}

  async assertHuman(token: string | undefined, ip?: string): Promise<void> {
    const secret = this.configService.get<string>(TURNSTILE_SECRET_KEY);
    if (!secret) {
      return;
    }
    if (!token) {
      throw new BadRequestException('The bot check is missing');
    }

    const body = new URLSearchParams({ secret, response: token });
    if (ip) {
      body.set('remoteip', ip);
    }

    const result = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
      .then(res => res.json() as Promise<{ success?: boolean }>)
      .catch((err: unknown) => {
        this.logger.error('Turnstile is unreachable', err);
        return null;
      });

    if (!result?.success) {
      throw new BadRequestException('The bot check failed, try again');
    }
  }
}
