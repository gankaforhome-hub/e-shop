import { MediaResponse } from '@modules/media/responses';
import { ApiProperty } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';

export class AdminCollectionTranslationResponse {
  @ApiProperty({
    description: 'Language of this translation',
    enum: E_Locale,
    enumName: 'E_Locale',
  })
  languageCode: E_Locale;

  @ApiProperty({ description: 'Title' })
  title: string;

  @ApiProperty({ description: 'Text for cards' })
  shortDescription: string;

  @ApiProperty({ description: 'Full description' })
  description: string;

  @ApiProperty({ description: 'Meta title', type: String, nullable: true })
  metaTitle: string | null;

  @ApiProperty({
    description: 'Meta description',
    type: String,
    nullable: true,
  })
  metaDescription: string | null;

  @ApiProperty({
    description: 'Line above the title on the hero slide',
    type: String,
    nullable: true,
  })
  bannerSubtitle: string | null;
}

// Everything the CMS edits, inactive collections included; texts in every language
export class AdminCollectionResponse {
  @ApiProperty({ description: 'Collection id (uuid)' })
  id: string;

  @ApiProperty({ description: 'URL slug, kebab-case' })
  slug: string;

  @ApiProperty({ description: 'Position in lists, ascending' })
  sortOrder: number;

  @ApiProperty({ description: 'Visible on the storefront' })
  isActive: boolean;

  @ApiProperty({
    description: 'Collection segment of generated SKUs',
    type: String,
    nullable: true,
  })
  skuPrefix: string | null;

  @ApiProperty({ description: 'Season slug', type: String, nullable: true })
  seasonSlug: string | null;

  @ApiProperty({ description: 'Shown in the home hero' })
  inBanner: boolean;

  @ApiProperty({ description: 'Position in the hero, ascending' })
  bannerSortOrder: number;

  @ApiProperty({
    description: 'Card image',
    type: MediaResponse,
    nullable: true,
  })
  coverImage: MediaResponse | null;

  @ApiProperty({
    description: 'Wide 16:9 image',
    type: MediaResponse,
    nullable: true,
  })
  bannerImage: MediaResponse | null;

  @ApiProperty({
    description: 'Texts in every language, uk first',
    type: [AdminCollectionTranslationResponse],
  })
  translations: AdminCollectionTranslationResponse[];

  @ApiProperty({ description: 'Creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'Last change time' })
  updatedAt: Date;
}
