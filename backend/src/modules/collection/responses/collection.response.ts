import { ApiProperty } from '@nestjs/swagger';
import { PublicMediaResponse } from '@modules/media/responses';
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
    description:
      'Collection segment of generated SKUs: three digits in creation order',
    example: '007',
  })
  skuPrefix: string;

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
    type: PublicMediaResponse,
    nullable: true,
  })
  media: PublicMediaResponse | null;
}
