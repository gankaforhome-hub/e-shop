import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { JWT_ACCESS_TOKEN_EXP, JWT_SECRET } from '@common/constants';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get(JWT_SECRET),
  signOptions: {
    expiresIn: config.get(JWT_ACCESS_TOKEN_EXP, '5m'),
  },
});

export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
