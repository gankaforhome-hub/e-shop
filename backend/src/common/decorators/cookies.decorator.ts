import { ExecutionContext, createParamDecorator } from '@nestjs/common';

//COMMENT decorator: get cookie by name cookie
export const Cookie = createParamDecorator(
  (keyCookie: string, ctx: ExecutionContext) => {
    if (!keyCookie) {
      return null;
    }
    const request = ctx.switchToHttp().getRequest();

    const cookie =
      keyCookie && keyCookie in request.cookies
        ? request.cookies[keyCookie]
        : keyCookie
          ? null
          : request.cookies;
    return cookie;
  },
);
