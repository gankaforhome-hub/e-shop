import { applyDecorators } from '@nestjs/common';
import { IsByteLength, IsString, MinLength } from 'class-validator';

//COMMENT decorator: password policy for a password being set
export const IsNewPassword = () =>
  applyDecorators(
    IsString({ message: 'password must be a string' }),
    MinLength(8, {
      message:
        'Password is too short. Minimal length is $constraint1 characters',
    }),
    //COMMENT bcrypt only uses the first 72 bytes
    IsByteLength(0, 72, {
      message: 'Password is too long. Max length is 72 bytes',
    }),
  );
