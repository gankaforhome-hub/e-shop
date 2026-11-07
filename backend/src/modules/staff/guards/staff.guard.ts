import { IAuthUser } from '@modules/auth/interfaces';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { E_StaffRole } from '@prisma/client';
import { StaffAccessService } from '../staff-access.service';

const STAFF_ROLES_KEY = 'staffRoles';

//COMMENT decorator: the roles a route needs, besides ADMIN and root who pass every check
export const StaffRoles = (...roles: E_StaffRole[]) =>
  SetMetadata(STAFF_ROLES_KEY, roles);

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly staffAccess: StaffAccessService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles =
      this.reflector.getAllAndOverride<E_StaffRole[]>(STAFF_ROLES_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];
    const { user } = ctx.switchToHttp().getRequest<{ user: IAuthUser }>();

    return this.staffAccess.hasRole(user, roles);
  }
}
