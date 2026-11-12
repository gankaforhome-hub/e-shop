import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JWT_ALGORITHM,
  JWT_ISSUER,
  JWT_SECRET,
  AuthAudience,
} from '@common/constants';
import { AuthService } from '../auth.service';
import { IAuthUser, IJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: Object.values(AuthAudience),
      secretOrKey: configService.getOrThrow<string>(JWT_SECRET),
    });
  }

  //COMMENT a signed token is not enough: the session must be alive and the data current.
  //The token must also agree with the session, so a token signed before a change is dead
  async validate(payload: IJwtPayload): Promise<IAuthUser> {
    const user = await this.authService.findSessionUser(
      payload.sid,
      payload.id,
      payload.aud,
    );

    if (!user || user.aud !== payload.aud || user.aal !== payload.aal) {
      throw new UnauthorizedException();
    }

    return { ...user, sid: payload.sid };
  }
}
