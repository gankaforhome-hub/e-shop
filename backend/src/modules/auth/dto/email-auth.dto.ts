import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EmailDto {
  @IsEmail(
    { allow_utf8_local_part: false },
    { message: 'Invalid email format. Please enter a valid email address' },
  )
  @IsNotEmpty({ message: 'Field "email" is required' })
  email: string;

  //COMMENT Cloudflare Turnstile token; checked only when TURNSTILE_SECRET_KEY is set
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  turnstileToken?: string;
}
