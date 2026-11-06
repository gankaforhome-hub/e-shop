import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { E_UserRole } from '@prisma/client';
import {
  IsEmail,
  // IsEnum,
  // IsPhoneNumber,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 55)
  @ApiProperty({
    type: String,
    example: 'mail@mail.com',
    description: 'user email',
  })
  readonly email: string;

  // @MinLength(6, {
  //   message:
  //     'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  // })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  @ApiProperty({
    type: String,
    example: 'password',
    description: 'user password',
  })
  readonly password: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Maksym',
    description: 'user name',
  })
  readonly name?: string;

  // @IsPhoneNumber()
  // @ApiProperty({ example: '+380777777777' })
  // phone?: string;

  // @IsEnum(E_UserRole[])
  // @ApiProperty({
  //   enum: E_UserRole,
  //   example: E_UserRole.USER,
  // })
  // roles?: E_UserRole[];
}
