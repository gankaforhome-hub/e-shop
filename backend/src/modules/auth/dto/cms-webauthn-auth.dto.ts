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

export class RegistrationOptionsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  enrollmentCode?: string;
}

export class VerifyRegistrationDto extends WebAuthnResponseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  enrollmentCode?: string;
}

export class AssertionOptionsDto {
  @IsIn(FRESH_ACTIONS)
  action: FreshAction;

  @IsOptional()
  @IsUUID()
  targetId?: string;
}
