import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

//COMMENT profile fields only: email and password changes need their own verified flows
export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'password',
] as const) {}
