import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail(
    { allow_utf8_local_part: false },
    {
      message: 'Invalid email format. Please enter a valid email address',
    },
  )
  @IsNotEmpty({ message: 'Field "email" is required' })
  @ApiProperty({ example: 'test@test.com' })
  email: string;

  //COMMENT no minimum here: sign-in must not reveal the password policy
  @MaxLength(72, {
    message: 'Password is too long. Max length is $constraint1 characters',
  })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'Field "password" is required' })
  @ApiProperty({ example: 'password' })
  password: string;
}
