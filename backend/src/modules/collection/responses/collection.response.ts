import { ApiProperty } from '@nestjs/swagger';
import { CollectionMediaResponse } from './collection-media.response';
import { CollectionSeasonResponse } from './season.response';

export class CollectionSeoResponse {
  @ApiProperty({ description: 'Meta title; the collection title if unset' })
  title: string;

  @ApiProperty({
    description: 'Meta description; the short description if unset',
  })
  description: string;
}

export class CollectionResponse {
  @ApiProperty({ description: 'Collection id (uuid)' })
  id: string;

  @ApiProperty({
    description: 'URL slug, kebab-case',
    example: 'vintage-bloom',
  })
  slug: string;

  @ApiProperty({ description: 'Position in lists, ascending' })
  sortOrder: number;

  @ApiProperty({
    description: 'Collection segment of generated SKUs',
    type: String,
    nullable: true,
  })
  skuPrefix: string | null;

  @ApiProperty({
    description: 'Season the collection belongs to',
    type: CollectionSeasonResponse,
    nullable: true,
  })
  season: CollectionSeasonResponse | null;

  @ApiProperty({ description: 'Localized title' })
  title: string;

  @ApiProperty({ description: 'Localized text for cards' })
  shortDescription: string;

  @ApiProperty({ description: 'Localized full description' })
  description: string;

  @ApiProperty({
    description: 'Localized SEO fields',
    type: CollectionSeoResponse,
  })
  seo: CollectionSeoResponse;

  @ApiProperty({
    description: 'Cover image for cards, close to square',
    type: CollectionMediaResponse,
    nullable: true,
  })
  media: CollectionMediaResponse | null;

  @ApiProperty({
    description: 'Wide 16:9 image for the home hero and banners',
    type: CollectionMediaResponse,
    nullable: true,
  })
  banner: CollectionMediaResponse | null;

  @ApiProperty({
    description:
      'Shown in the home hero (GET /collections/banners); always has a banner image',
  })
  inBanner: boolean;

  @ApiProperty({
    description: 'Position in the hero, ascending; ties follow sortOrder',
  })
  bannerSortOrder: number;

  @ApiProperty({
    description: 'Localized line above the title on the hero slide',
    type: String,
    nullable: true,
    example: 'нова колекція',
  })
  bannerSubtitle: string | null;
}
