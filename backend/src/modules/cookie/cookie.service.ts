import { NODE_ENV } from '@common/constants';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { ConfigService } from '@nestjs/config';
import { ICookie } from './interfaces';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  async setToCookies(cookie: ICookie, res: Response) {
    res.cookie(cookie.name, cookie.value, {
      //COMMENT cookies: not available through the remote control on the client
      httpOnly: true,
      //COMMENT cookies: access only from the same site
      sameSite: 'lax',
      //COMMENT cookies: expires cookie
      expires: new Date(cookie.expires),
      //COMMENT cookies: secure http for development or https protocol for production
      secure: this.configService.get(NODE_ENV, 'development') === 'production',
      //COMMENT cookies: accesses path for cookies
      path: '/',
    });
  }

  async removeFromCookies(key: string, res: Response) {
    res.clearCookie(key);
  }

  getCookies(key: string, res: Response) {
    res.send('Check console for Set-Cookie header');
  }
}
