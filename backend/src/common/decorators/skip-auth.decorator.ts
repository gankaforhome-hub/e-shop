import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_SKIP_AUTH_KEY = 'isSkipAuth';
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true);
export const isSkipAuth = (
  ctx: ExecutionContext,
  reflector: Reflector,
): boolean => {
  // const req = ctx.switchToHttp().getRequest();

  // const accessToken = req.headers.authorization?.split(' ')[1];
  // const refreshToken = req.headers.cookie?.split(`${REFRESH_TOKEN}=`)[1] ?? '';

  //COMMENT Checks if the deleted refresh token with the cookie by client when the access token is available
  // if (accessToken && !refreshToken) {
  //   throw new UnauthorizedException();
  // }

  const isSkipAuth = reflector.getAllAndOverride<boolean>(IS_SKIP_AUTH_KEY, [
    ctx.getHandler(),
    ctx.getClass(),
  ]);
  return isSkipAuth;
};
