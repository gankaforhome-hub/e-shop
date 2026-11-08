import { ApiPropertyOptional } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class CollectionQueryDto {
  @ApiPropertyOptional({
    description: 'Language of the texts. Missing translations fall back to uk',
    enum: E_Locale,
    enumName: 'E_Locale',
    default: E_Locale.uk,
  })
  @IsOptional()
  @IsEnum(E_Locale)
  lang?: E_Locale;
}
