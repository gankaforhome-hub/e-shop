import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

//COMMENT the storefront forwards Google's authorization code and its own callback URL
export class GoogleSignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  @ApiProperty()
  code: string;

  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  @MaxLength(2048)
  @ApiProperty({ example: 'http://localhost:3000/api/auth/google/callback' })
  redirectUri: string;
}
