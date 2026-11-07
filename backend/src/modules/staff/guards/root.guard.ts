import { IAuthUser } from '@modules/auth/interfaces';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { StaffAccessService } from '../staff-access.service';

@Injectable()
export class RootGuard implements CanActivate {
  constructor(private readonly staffAccess: StaffAccessService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest<{ user: IAuthUser }>();
    return this.staffAccess.isRoot(user);
  }
}
