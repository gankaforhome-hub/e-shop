import { FRESH_ACTIONS, FreshAction } from '@modules/staff/staff.constants';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

//COMMENT the shape of `response` is checked by the WebAuthn library, not here
export class WebAuthnResponseDto {
  @IsObject()
  response: Record<string, unknown>;
}

//COMMENT a root's first key needs ROOT_ENROLLMENT_CODE from the server env
export class RegistrationOptionsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  enrollmentCode?: string;
}

export class VerifyRegistrationDto extends WebAuthnResponseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  enrollmentCode?: string;
}

export class AssertionOptionsDto {
  @IsIn(FRESH_ACTIONS)
  action: FreshAction;

  @IsOptional()
  @IsUUID()
  targetId?: string;
}
