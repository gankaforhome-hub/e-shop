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
const SKU_PREFIX_PATTERN = /^[A-Z0-9]{1,8}$/;
const LOCALE_COUNT = Object.values(E_Locale).length;

// The fallback language must always have a text
@ValidatorConstraint({ name: 'HasUkTranslation', async: false })
class HasUkTranslationConstraint implements ValidatorConstraintInterface {
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
    description: 'Collection segment of generated SKUs: A-Z, 0-9, up to 8',
    type: String,
    nullable: true,
    example: 'AGRO',
  })
  @IsOptional()
  @Matches(SKU_PREFIX_PATTERN, {
    message: 'skuPrefix must be 1-8 characters A-Z or 0-9',
  })
  skuPrefix?: string | null;

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

  @ApiPropertyOptional({
    description:
      'Wide 16:9 image (media id); null removes it, not allowed while inBanner',
    type: String,
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  bannerImageId?: string | null;

  @ApiPropertyOptional({
    description: 'Show in the home hero; needs a banner image',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  inBanner?: boolean;

  @ApiPropertyOptional({
    description: 'Position in the hero, ascending; ties follow sortOrder',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bannerSortOrder?: number;

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
