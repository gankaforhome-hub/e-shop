import { IAuthUser } from '@modules/auth/interfaces';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { FRESH_ASSERTION_HEADER, FreshAction } from '../staff.constants';
import { WebAuthnService } from '../webauthn.service';

const FRESH_ACTION_KEY = 'freshAction';

//COMMENT decorator: the action a key must confirm in this very request
export const RequireFreshAssertion = (action: FreshAction) =>
  SetMetadata(FRESH_ACTION_KEY, action);

/**
 * Stolen tokens and a leaked JWT secret stop here: the request must carry a signature
 * from the physical key, over a challenge issued for this action on this target.
 * Keys are optional, so a user without a key passes on the password session alone.
 */
@Injectable()
export class FreshAssertionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly webAuthn: WebAuthnService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get<FreshAction>(
      FRESH_ACTION_KEY,
      ctx.getHandler(),
    );
    const req = ctx.switchToHttp().getRequest<Request & { user: IAuthUser }>();
    if (!req.user.hasKey) {
      return true;
    }

    await this.webAuthn.assertFresh(
      req.user,
      action,
      req.params.userId as string,
      req.headers[FRESH_ASSERTION_HEADER] as string | undefined,
      req.ip,
    );
    return true;
  }
}
