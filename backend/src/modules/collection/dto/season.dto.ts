import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { HasUkTranslationConstraint } from './create-collection.dto';

// Lowercase words joined by "-" or "_": the existing seed has new_year
export const SEASON_SLUG_PATTERN = /^[a-z0-9]+([_-][a-z0-9]+)*$/;
const LOCALE_COUNT = Object.values(E_Locale).length;

export class SeasonTranslationDto {
  @ApiProperty({
    description: 'Language of this label',
    enum: E_Locale,
    enumName: 'E_Locale',
  })
  @IsEnum(E_Locale)
  languageCode: E_Locale;

  @ApiProperty({ description: 'Season name', maxLength: 50, example: 'Зима' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;
}

export class CreateSeasonDto {
  @ApiProperty({
    description:
      'Catalog filter value (?season=); lowercase Latin words joined by - or _. Never changes',
    example: 'new_year',
    maxLength: 50,
  })
  @Matches(SEASON_SLUG_PATTERN, {
    message: 'slug must be lowercase Latin words joined by - or _',
  })
  @MaxLength(50)
  slug: string;

  @ApiPropertyOptional({
    description: 'Position in the filter, ascending',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({
    description: 'Labels per language, one per languageCode, uk required',
    type: [SeasonTranslationDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(LOCALE_COUNT)
  @ArrayUnique((t: SeasonTranslationDto) => t?.languageCode, {
    message: 'translations must have one item per languageCode',
  })
  @Validate(HasUkTranslationConstraint)
  @ValidateNested({ each: true })
  @Type(() => SeasonTranslationDto)
  translations: SeasonTranslationDto[];
}

//COMMENT the slug is the key collections refer to, so it stays as it is
export class UpdateSeasonDto {
  @ApiPropertyOptional({
    description: 'Position in the filter, ascending',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description:
      'Labels to create or replace; languages not listed stay as they are',
    type: [SeasonTranslationDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(LOCALE_COUNT)
  @ArrayUnique((t: SeasonTranslationDto) => t?.languageCode, {
    message: 'translations must have one item per languageCode',
  })
  @ValidateNested({ each: true })
  @Type(() => SeasonTranslationDto)
  translations?: SeasonTranslationDto[];
}
