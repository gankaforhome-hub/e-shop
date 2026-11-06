import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail(
    { allow_utf8_local_part: false },
    { message: 'Invalid email format. Please enter a valid email address' },
  )
  @IsNotEmpty({ message: 'Field "newEmail" is required' })
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  password: string;
}

export class ConfirmEmailChangeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  token: string;
}
