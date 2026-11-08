import { FRONTEND_REVALIDATE_URL, REVALIDATE_SECRET } from '@common/constants';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const REQUEST_TIMEOUT_MS = 3000;

/** Tells the storefront which cache tags to drop after a CMS change. */
@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * Fire-and-forget: never throws and is not awaited by callers, so a slow or
   * absent storefront can't fail or delay a CMS mutation. Skipped when the URL
   * or the secret is not configured.
   */
  notify(tags: readonly string[]): void {
    const url = this.config.get<string>(FRONTEND_REVALIDATE_URL);
    const secret = this.config.get<string>(REVALIDATE_SECRET);
    const unique = [...new Set(tags)];

    if (!url || !secret) {
      this.logger.debug(
        `Revalidation skipped (not configured): ${unique.join(', ')}`,
      );
      return;
    }

    void this.send(url, secret, unique);
  }

  private async send(url: string, secret: string, tags: string[]) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': secret,
        },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.ok) {
        this.logger.log(`Storefront revalidated: ${tags.join(', ')}`);
      } else {
        this.logger.warn(
          `Storefront revalidation answered ${response.status}: ${tags.join(', ')}`,
        );
      }
    } catch (error) {
      this.logger.warn(`Storefront revalidation failed: ${String(error)}`);
    }
  }
}
