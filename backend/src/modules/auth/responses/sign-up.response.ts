import { ApiOperation } from '@nestjs/swagger';
import { ApiAcceptedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { MessageResponse } from './message.response';

export const ApiSignUpOperation = () => ApiOperation({ summary: '🎭 sign-up' });

export const ApiSignUpAcceptedResponse = () =>
  ApiAcceptedResponse({
    description:
      'The same response whether or not the email already has an account, so it does not reveal which accounts exist. The next step is in the email.',
    type: MessageResponse,
  });

export const ApiSignUpBadRequestResponse = () =>
  ApiBadRequestResponse({
    description: 'Bad request (invalid request body)',
    content: {
      'application/json': {
        example: {
          errors: [
            'Field "email" is required',
            'Invalid email format. Please enter a valid email address',
            'Field "password" is required',
            'password must be a string',
            'Password is too short. Minimal length is $constraint1 characters',
            'Password is too long. Max length is 72 bytes',
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
