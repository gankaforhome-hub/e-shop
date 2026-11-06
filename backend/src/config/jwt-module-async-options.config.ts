import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import {
  JWT_ACCESS_TOKEN_EXP,
  JWT_ALGORITHM,
  JWT_ISSUER,
  JWT_SECRET,
} from '@common/constants';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.getOrThrow<string>(JWT_SECRET),
  signOptions: {
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
    expiresIn: config.getOrThrow(JWT_ACCESS_TOKEN_EXP),
  },
});

export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
