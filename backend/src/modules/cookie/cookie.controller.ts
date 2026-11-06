import { Controller, Get, Res } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { SkipAuth } from '@common/decorators';
@Controller('cookie')
export class CookieController {
  constructor(private readonly cookieService: CookieService) {}

  @SkipAuth()
  @Get()
  getCookies(@Res({ passthrough: true }) res: Response) {
    return this.cookieService.getCookies('111', res);
  }
}
