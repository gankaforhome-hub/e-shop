import { JWT_SECRET, REFRESH_TOKEN } from '@common/constants';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from '@modules/auth/interfaces';
import { Token } from '@prisma/client';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies[REFRESH_TOKEN];

    if (accessToken && !refreshToken) {
      const key = this.configService.get(JWT_SECRET);
      try {
        const isValidToken = accessToken
          ? (jwt.verify(accessToken, key) as IJwtPayload)
          : ({} as IJwtPayload);

        const userAgent = req.headers['user-agent'] ?? '';

        const existingToken =
          (await this.authService.findSessionByUserIdAndUserAgent(
            isValidToken.id,
            userAgent,
          )) as Token;

        if (!existingToken) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            message: 'Unauthorized',
            statusCode: 401,
          });
        }

        await this.authService.deleteSession(existingToken.familyId);

        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Unauthorized',
          statusCode: 401,
        });
      } catch (error) {}
    }

    return next();
  }
}
