import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsIn(['development', 'test', 'production'])
  NODE_ENV?: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  //COMMENT also passed to jsonwebtoken, which does not understand "M" (months)
  @Matches(/^\d+[smhd]$/)
  JWT_ACCESS_TOKEN_EXP: string;

  @Matches(/^\d+[smhdMy]$/)
  JWT_REFRESH_TOKEN_EXP: string;

  @IsOptional()
  @Matches(/^\d+$/)
  TRUST_PROXY_HOPS?: string;
}

//COMMENT fails on startup; the messages name the variable and never contain its value
export const validateEnv = (config: Record<string, unknown>) => {
  const errors = validateSync(plainToInstance(EnvironmentVariables, config));

  if (errors.length > 0) {
    const messages = errors.flatMap(({ constraints }) =>
      Object.values(constraints ?? {}),
    );
    throw new Error(
      `Invalid environment variables:\n- ${messages.join('\n- ')}`,
    );
  }

  return config;
};
