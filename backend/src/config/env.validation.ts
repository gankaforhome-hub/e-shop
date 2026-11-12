import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateIf,
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

  //COMMENT storefront links in customer emails; falls back to the local frontend outside production
  @ValidateIf(
    (env: EnvironmentVariables) =>
      env.NODE_ENV === 'production' || env.FRONTEND_URL !== undefined,
  )
  @IsUrl({ require_tld: false })
  FRONTEND_URL?: string;

  //COMMENT CMS links in staff emails (invite, password reset); unset: FRONTEND_URL, then localhost:3030
  @ValidateIf((env: EnvironmentVariables) => !!env.CMS_URL)
  @IsUrl({ require_tld: false })
  CMS_URL?: string;

  //COMMENT lets a root add the first key; empty or unset means no root can enroll a key
  @ValidateIf((env: EnvironmentVariables) => !!env.ROOT_ENROLLMENT_CODE)
  @IsString()
  @MinLength(32)
  ROOT_ENROLLMENT_CODE?: string;

  //COMMENT Cloudflare Turnstile on sign-up and forgot-password; empty or unset means off
  @IsOptional()
  @IsString()
  TURNSTILE_SECRET_KEY?: string;

  //COMMENT storefront Google sign-in; both unset = POST /auth/google answers 404
  @IsOptional()
  @IsString()
  GOOGLE_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  GOOGLE_CLIENT_SECRET?: string;

  //COMMENT media storage: the project URL, not the S3 endpoint
  @IsUrl({ require_tld: false })
  SUPABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SECRET_KEY: string;

  @Matches(/^[a-z0-9-]+$/)
  MEDIA_BUCKET: string;

  //COMMENT storefront revalidation after CMS changes; empty or unset means skipped
  @ValidateIf((env: EnvironmentVariables) => !!env.FRONTEND_REVALIDATE_URL)
  @IsUrl({ require_tld: false })
  FRONTEND_REVALIDATE_URL?: string;

  @IsOptional()
  @IsString()
  REVALIDATE_SECRET?: string;

  //COMMENT mail provider; empty or unset means console output (refused in production)
  @IsOptional()
  @IsString()
  RESEND_API_KEY?: string;

  //COMMENT sender, e.g. "Ganka for Home <noreply@example.com>"; the domain must be verified in Resend
  @ValidateIf((env: EnvironmentVariables) => !!env.RESEND_API_KEY)
  @IsString()
  @IsNotEmpty()
  MAIL_FROM?: string;
}

//COMMENT fails on startup; the messages name the variable and never contain its value
export const validateEnv = (config: Record<string, unknown>) => {
  const env = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(env);
  const messages = errors.flatMap(({ constraints }) =>
    Object.values(constraints ?? {}),
  );

  if (messages.length > 0) {
    throw new Error(
      `Invalid environment variables:\n- ${messages.join('\n- ')}`,
    );
  }

  return config;
};
