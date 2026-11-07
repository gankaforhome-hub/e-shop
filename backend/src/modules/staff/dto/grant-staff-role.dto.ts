import { E_StaffRole } from '@prisma/client';
import { IsIn } from 'class-validator';

//COMMENT ROOT is missing on purpose: only the CLI can create it
export const GRANTABLE_ROLES = [
  E_StaffRole.ADMIN,
  E_StaffRole.CONTENT_EDITOR,
  E_StaffRole.CATALOG_MANAGER,
  E_StaffRole.ORDER_MANAGER,
] as const;

export class GrantStaffRoleDto {
  @IsIn(GRANTABLE_ROLES)
  role: (typeof GRANTABLE_ROLES)[number];
}
