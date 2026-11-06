import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

export class SignUpResponse {
  @ApiProperty({
    description: "User's id",
    example: '41aeb541-3812-4320-8139-58899a66face',
  })
  id: string;

  @ApiProperty({ description: "User's email", example: 'test@test.com' })
  email: string;

  @ApiProperty({ description: "User's roles", example: '["USER"]' })
  roles: $Enums.E_UserRole[];
}

export const ApiSignUpOperation = () => ApiOperation({ summary: '🎭 sign-up' });

export const ApiSignUpCreatedResponse = () =>
  ApiCreatedResponse({
    status: 201,
    description: 'Successful operation',
    type: SignUpResponse,
  });

export const ApiSignUpBadRequestResponse = () =>
  ApiBadRequestResponse({
    status: 400,
    description: 'Bad request (invalid request body)',
    content: {
      'application/json': {
        example: {
          errors: [
            'Unable to sign up with data ${JSON.stringify(signUpDto)}',
            'Field "email" is required',
            'Invalid email format. Please enter a valid email address',
            'Field "password" is required',
            'password must be a string',
            'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
            'Password is too long. Max length is $constraint1 characters, but actual is $value',
            'repeatPassword must be a string',
            'Field "passwordRepeat" is required',
            'Passwords do not match',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  });

export const ApiSignUpConflictResponse = () =>
  ApiConflictResponse({
    status: 409,
    description: 'Provided email already exists',
    content: {
      'application/json': {
        example: {
          message: 'User with this email is already registered',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  });
