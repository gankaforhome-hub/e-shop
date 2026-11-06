import { ExecutionContext, createParamDecorator } from '@nestjs/common';

//COMMENT decorator: get user agent from request
export const UserAgent = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
  },
);
