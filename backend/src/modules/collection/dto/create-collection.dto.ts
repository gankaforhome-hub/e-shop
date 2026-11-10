import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CollectionTranslationDto } from './collection-translation.dto';

export const COLLECTION_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LOCALE_COUNT = Object.values(E_Locale).length;

// The fallback language must always have a text
@ValidatorConstraint({ name: 'HasUkTranslation', async: false })
export class HasUkTranslationConstraint implements ValidatorConstraintInterface {
  validate(translations: unknown) {
    return (
      Array.isArray(translations) &&
      translations.some(
        (t: { languageCode?: unknown }) => t?.languageCode === E_Locale.uk,
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must include a ${E_Locale.uk} translation`;
  }
}

//COMMENT no skuPrefix: the database assigns it (three digits in creation order) and it never changes
export class CreateCollectionDto {
  @ApiProperty({
    description: 'URL slug, kebab-case',
    example: 'vintage-bloom',
    maxLength: 100,
  })
  @Matches(COLLECTION_SLUG_PATTERN, { message: 'slug must be kebab-case' })
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    description: 'Position in lists, ascending',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Visible on the storefront',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Season slug; null removes the season',
    type: String,
    nullable: true,
    example: 'winter',
  })
  @IsOptional()
  @MaxLength(50)
  seasonSlug?: string | null;

  @ApiPropertyOptional({
    description: 'Card image (media id); null removes it',
    type: String,
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  coverImageId?: string | null;

  @ApiProperty({
    description: 'Texts per language, one per languageCode, uk required',
    type: [CollectionTranslationDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(LOCALE_COUNT)
  @ArrayUnique((t: CollectionTranslationDto) => t?.languageCode, {
    message: 'translations must have one item per languageCode',
  })
  @Validate(HasUkTranslationConstraint)
  @ValidateNested({ each: true })
  @Type(() => CollectionTranslationDto)
  translations: CollectionTranslationDto[];
}
