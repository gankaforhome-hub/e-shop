import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET } from '@common/constants';
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
      secretOrKey: configService.getOrThrow<string>(JWT_SECRET),
    });
  }

  //COMMENT a signed token is not enough: the session must be alive and the data current
  async validate(payload: IJwtPayload): Promise<IAuthUser> {
    const user = await this.authService.findSessionUser(
      payload.sid,
      payload.id,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user, sid: payload.sid };
  }
}
