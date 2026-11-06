import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET } from '@common/constants';
import { IJwtPayload } from '../interfaces';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private readonly configService: ConfigService,
    private readonly userService: UserService, // private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      secretOrKey: configService.getOrThrow<string>(JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userService.findOneByIdOrEmail(payload.id);

    if (!user /*  || !isAuth */) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
