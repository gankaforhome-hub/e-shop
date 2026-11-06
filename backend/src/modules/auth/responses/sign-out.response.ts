import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSignOutOperation = () =>
  ApiOperation({
    summary: '📤 sign-out',
    description: 'Cookie with name "REFRESH_TOKEN" included in  request',
  });

export const ApiSignOutOkResponse = () =>
  ApiNoContentResponse({
    status: 204,
    description: 'Successful operation',
  });

export const ApiSignOutUnauthorizedResponse = () =>
  ApiUnauthorizedResponse({
    status: 401,
    description: 'Refresh token is absent',
    content: {
      'application/json': {
        example: {
          message: 'Refresh token is absent',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  });
