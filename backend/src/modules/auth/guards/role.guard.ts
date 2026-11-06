import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { E_UserRole } from '@prisma/client';

import { ROLES_KEY } from '@common/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<E_UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // return requiredRoles.some(
    //   role => user.roles?.map(String).includes(String(role))
    // );
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
