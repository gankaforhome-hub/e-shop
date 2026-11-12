import {
  CMS_ORIGINS,
  NODE_ENV,
  STOREFRONT_ORIGINS,
  AuthAudience,
} from '@common/constants';
import { parseEnvList } from '@common/utils';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

const CHECK_ORIGIN_KEY = 'checkOrigin';

const ORIGINS_ENV: Record<AuthAudience, string> = {
  [AuthAudience.CMS]: CMS_ORIGINS,
  [AuthAudience.STOREFRONT]: STOREFRONT_ORIGINS,
};

//COMMENT decorator: which app may use this cookie route
export const CheckOrigin = (audience: AuthAudience) =>
  SetMetadata(CHECK_ORIGIN_KEY, audience);

/**
 * Keeps sessions of one app away from the other: XSS on the storefront can make the browser
 * send a same-site CMS cookie, but it can't forge the Origin header.
 */
@Injectable()
export class OriginGuard implements CanActivate {
  private readonly logger = new Logger(OriginGuard.name);
  private readonly warned = new Set<AuthAudience>();

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const audience = this.reflector.get<AuthAudience>(
      CHECK_ORIGIN_KEY,
      ctx.getHandler(),
    );
    const envName = ORIGINS_ENV[audience];
    const origins = parseEnvList(this.configService.get<string>(envName));

    if (origins.length === 0) {
      if (this.configService.get(NODE_ENV) === 'production') {
        throw new ForbiddenException();
      }
      if (!this.warned.has(audience)) {
        this.warned.add(audience);
        this.logger.warn(`${envName} is empty, the Origin check is skipped`);
      }
      return true;
    }

    const { origin } = ctx.switchToHttp().getRequest<Request>().headers;
    if (!origin || !origins.includes(origin)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
