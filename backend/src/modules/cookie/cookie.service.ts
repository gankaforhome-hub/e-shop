import { AUTH_COOKIE_PATH, NODE_ENV } from '@common/constants';
import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

import { ConfigService } from '@nestjs/config';
import { ICookie } from './interfaces';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  //COMMENT a cookie is only cleared when these options match the ones it was set with
  private get options(): CookieOptions {
    return {
      //COMMENT cookies: not available through the remote control on the client
      httpOnly: true,
      //COMMENT cookies: access only from the same site
      sameSite: 'lax',
      //COMMENT cookies: secure http for development or https protocol for production
      secure: this.configService.get(NODE_ENV, 'development') === 'production',
      //COMMENT cookies: accesses path for cookies
      path: AUTH_COOKIE_PATH,
    };
  }

  async setToCookies(cookie: ICookie, res: Response) {
    res.cookie(cookie.name, cookie.value, {
      ...this.options,
      //COMMENT cookies: expires cookie
      expires: new Date(cookie.expires),
    });
  }

  async removeFromCookies(key: string, res: Response) {
    res.clearCookie(key, this.options);
  }

  getCookies(key: string, res: Response) {
    res.send('Check console for Set-Cookie header');
  }
}
