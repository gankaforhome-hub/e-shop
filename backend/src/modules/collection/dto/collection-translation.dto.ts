import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// A full translation: on PATCH it replaces that language's row as a whole
export class CollectionTranslationDto {
  @ApiProperty({
    description: 'Language of this translation',
    enum: E_Locale,
    enumName: 'E_Locale',
  })
  @IsEnum(E_Locale)
  languageCode: E_Locale;

  @ApiProperty({ description: 'Title', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({ description: 'Text for cards' })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({
    description: 'Full description; blank lines split paragraphs',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Meta title; the title is used when empty',
    type: String,
    nullable: true,
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  metaTitle?: string | null;

  @ApiPropertyOptional({
    description: 'Meta description; the short description is used when empty',
    type: String,
    nullable: true,
    maxLength: 320,
  })
  @IsOptional()
  @IsString()
  @MaxLength(320)
  metaDescription?: string | null;
}
