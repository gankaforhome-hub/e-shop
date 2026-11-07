import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AUDIENCES_KEY } from '@common/decorators/audiences.decorator';
import { isSkipAuth } from '@common/decorators/skip-auth.decorator';
import { E_AuthAudience } from '@prisma/client';
import { IAuthUser } from '../interfaces';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const _isSkipAuth = isSkipAuth(ctx, this.reflector);
    if (_isSkipAuth) {
      return true;
    }

    await super.canActivate(ctx);

    //COMMENT a route that says nothing accepts storefront sessions only, so a new
    //route can't open itself to the other audience by accident
    const audiences = this.reflector.getAllAndOverride<E_AuthAudience[]>(
      AUDIENCES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    ) ?? [E_AuthAudience.STOREFRONT];
    const { user } = ctx.switchToHttp().getRequest<{ user: IAuthUser }>();

    if (!audiences.includes(user.aud)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
