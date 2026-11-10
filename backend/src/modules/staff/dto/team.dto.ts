import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { GRANTABLE_ROLES } from './grant-staff-role.dto';

type GrantableRole = (typeof GRANTABLE_ROLES)[number];

//COMMENT ADMIN passes validation; the service lets only a root assign it
export class InviteStaffDto {
  @IsEmail({ allow_utf8_local_part: false })
  @IsNotEmpty()
  email: string;

  @IsIn(GRANTABLE_ROLES)
  role: GrantableRole;
}

export class ChangeStaffRoleDto {
  @IsIn(GRANTABLE_ROLES)
  role: GrantableRole;
}
