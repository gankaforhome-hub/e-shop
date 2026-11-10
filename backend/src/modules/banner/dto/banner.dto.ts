import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { E_BannerLinkType, E_Locale } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

// An internal path or an http(s) link; "//host" is another site, not a path. The database
// CHECK says the same
export const BANNER_URL_PATTERN = /^(\/(?!\/)[^\s]*|https?:\/\/[^\s]+)$/;
const LOCALE_COUNT = Object.values(E_Locale).length;

export class BannerQueryDto {
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

// Every text is optional; empty strings are stored as null
export class BannerTranslationDto {
  @ApiProperty({
    description: 'Language of these texts',
    enum: E_Locale,
    enumName: 'E_Locale',
  })
  @IsEnum(E_Locale)
  languageCode: E_Locale;

  @ApiPropertyOptional({
    description:
      'Slide title; a collection slide without one shows the collection title',
    type: String,
    nullable: true,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string | null;

  @ApiPropertyOptional({
    description: 'Line above the title',
    type: String,
    nullable: true,
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  subtitle?: string | null;

  @ApiPropertyOptional({
    description: 'Button text; empty: the storefront default for the link type',
    type: String,
    nullable: true,
    maxLength: 40,
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  ctaLabel?: string | null;
}

export class CreateBannerDto {
  @ApiProperty({
    description: 'Where the slide leads',
    enum: E_BannerLinkType,
    enumName: 'E_BannerLinkType',
  })
  @IsEnum(E_BannerLinkType)
  linkType: E_BannerLinkType;

  @ApiPropertyOptional({
    description: 'COLLECTION: the collection id',
    type: String,
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  collectionId?: string | null;

  @ApiPropertyOptional({
    description: 'URL: an internal path (/products) or an http(s) link',
    type: String,
    nullable: true,
    maxLength: 500,
    example: '/products',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(BANNER_URL_PATTERN, {
    message: 'url must be an internal path (/…) or an http(s) link',
  })
  url?: string | null;

  @ApiProperty({ description: 'Wide 16:9 image (media id)', format: 'uuid' })
  @IsUUID()
  imageId: string;

  @ApiPropertyOptional({
    description: 'Shown on the storefront',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Show from this moment; null: no start limit',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsISO8601()
  startsAt?: string | null;

  @ApiPropertyOptional({
    description: 'Show until this moment; null: no end limit',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsISO8601()
  endsAt?: string | null;

  @ApiPropertyOptional({
    description:
      'Texts per language, one per languageCode; a URL slide needs a uk title',
    type: [BannerTranslationDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(LOCALE_COUNT)
  @ArrayUnique((t: BannerTranslationDto) => t?.languageCode, {
    message: 'translations must have one item per languageCode',
  })
  @ValidateNested({ each: true })
  @Type(() => BannerTranslationDto)
  translations?: BannerTranslationDto[];
}

//COMMENT omitted fields stay; listed translations replace that language's row as a whole
export class UpdateBannerDto extends PartialType(CreateBannerDto) {}

export class BannerOrderDto {
  @ApiProperty({
    description:
      'Every banner id in the new order; sortOrder becomes the 1-based position',
    type: [String],
    format: 'uuid',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ArrayUnique({ message: 'ids must not repeat' })
  @IsUUID('all', { each: true })
  ids: string[];
}
