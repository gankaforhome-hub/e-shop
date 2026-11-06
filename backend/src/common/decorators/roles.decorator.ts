import { SetMetadata } from '@nestjs/common';
import { E_UserRole } from '@prisma/client';

//COMMENT decorator: get user roles
export const ROLES_KEY = 'roles';

export const Roles = (...roles: E_UserRole[]) => SetMetadata(ROLES_KEY, roles);
