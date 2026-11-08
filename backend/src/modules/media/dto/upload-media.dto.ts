import { IsOptional, IsString, MaxLength } from 'class-validator';
import { MEDIA_ALT_MAX_LENGTH } from '../media.constants';

// Text fields of the multipart upload; the file itself comes through FileInterceptor.
// Swagger describes the whole body with @ApiBody on the route
export class UploadMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(MEDIA_ALT_MAX_LENGTH)
  alt?: string;
}
