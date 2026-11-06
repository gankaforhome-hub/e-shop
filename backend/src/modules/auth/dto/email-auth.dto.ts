import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsEmail(
    { allow_utf8_local_part: false },
    { message: 'Invalid email format. Please enter a valid email address' },
  )
  @IsNotEmpty({ message: 'Field "email" is required' })
  email: string;
}
