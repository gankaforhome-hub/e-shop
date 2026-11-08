import { E_Locale } from '@prisma/client';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CollectionTranslationDto } from './collection-translation.dto';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(
  OmitType(CreateCollectionDto, ['translations'] as const),
) {
  @ApiPropertyOptional({
    description:
      'Translations to create or replace, one per languageCode; languages not listed stay as they are',
    type: [CollectionTranslationDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(Object.values(E_Locale).length)
  @ArrayUnique((t: CollectionTranslationDto) => t?.languageCode, {
    message: 'translations must have one item per languageCode',
  })
  @ValidateNested({ each: true })
  @Type(() => CollectionTranslationDto)
  translations?: CollectionTranslationDto[];
}
