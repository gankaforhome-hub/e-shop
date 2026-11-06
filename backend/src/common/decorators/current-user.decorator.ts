import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IAuthUser } from '@modules/auth/interfaces';
export const CurrentUser = createParamDecorator(
  (
    key: keyof IAuthUser,
    ctx: ExecutionContext,
  ): IAuthUser | Partial<IAuthUser> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
