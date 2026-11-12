import { IsPasswordsMatchingConstraint } from '@common/decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class SignUpDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Field "firstName" is required' })
  @MaxLength(100)
  @ApiProperty({ example: 'Olena' })
  firstName: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Field "lastName" is required' })
  @MaxLength(100)
  @ApiProperty({ example: 'Kovalenko' })
  lastName: string;

  @IsEmail(
    { allow_utf8_local_part: false },
    {
      message: 'Invalid email format. Please enter a valid email address',
    },
  )
  @IsNotEmpty({ message: 'Field "email" is required' })
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @MinLength(8, {
    message: 'Password is too short. Minimal length is $constraint1 characters',
  })
  //COMMENT bcrypt only uses the first 72 bytes
  @IsByteLength(0, 72, {
    message: 'Password is too long. Max length is 72 bytes',
  })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'Field "password" is required' })
  @ApiProperty({ example: 'password' })
  password: string;

  @IsString({ message: 'repeatPassword must be a string' })
  @Validate(IsPasswordsMatchingConstraint)
  @IsNotEmpty({ message: 'Field "passwordRepeat" is required' })
  @ApiProperty({ example: 'password' })
  passwordRepeat: string;

  //COMMENT optional; E.164 as the storefront's phone input sends it
  @IsOptional()
  @Matches(/^\+[1-9]\d{7,14}$/, { message: 'phone must be in E.164 format' })
  @IsPhoneNumber(undefined, { message: 'phone is not a valid number' })
  @ApiPropertyOptional({ example: '+380671234567' })
  phone?: string;

  //COMMENT the terms and the privacy policy must be accepted; stored with TERMS_VERSION
  @Equals(true, { message: 'The terms must be accepted' })
  @ApiProperty({ example: true })
  acceptTerms: boolean;

  //COMMENT separate opt-in for news and offers, off unless ticked
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  marketingConsent?: boolean;

  //COMMENT Cloudflare Turnstile token; checked only when TURNSTILE_SECRET_KEY is set
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @ApiPropertyOptional()
  turnstileToken?: string;
}
