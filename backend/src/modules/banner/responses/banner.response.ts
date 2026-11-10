import { MediaResponse, PublicMediaResponse } from '@modules/media/responses';
import { ApiProperty } from '@nestjs/swagger';
import { E_BannerLinkType, E_Locale } from '@prisma/client';

export const BANNER_STATUSES = [
  'live',
  'hidden',
  'scheduled',
  'expired',
] as const;
export type BannerStatus = (typeof BANNER_STATUSES)[number];

export class BannerLinkResponse {
  @ApiProperty({ enum: ['collection', 'url'] })
  type: 'collection' | 'url';

  @ApiProperty({
    description: 'collection: its slug (/collection/<slug>)',
    type: String,
    nullable: true,
  })
  collectionSlug: string | null;

  @ApiProperty({
    description: 'url: an internal path or an http(s) link',
    type: String,
    nullable: true,
  })
  url: string | null;
}

// A home hero slide as the storefront shows it
export class BannerResponse {
  @ApiProperty({ description: 'Banner id (uuid)' })
  id: string;

  @ApiProperty({
    description:
      'Localized title; a collection slide without one gets the collection title',
  })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Line above the title',
  })
  subtitle: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Button text; null: the storefront default for the link type',
  })
  ctaLabel: string | null;

  @ApiProperty({ type: BannerLinkResponse })
  link: BannerLinkResponse;

  @ApiProperty({ type: PublicMediaResponse, description: 'Wide 16:9 image' })
  image: PublicMediaResponse;
}

export class BannerTextResponse {
  @ApiProperty({ enum: E_Locale, enumName: 'E_Locale' })
  languageCode: E_Locale;

  @ApiProperty({ type: String, nullable: true })
  title: string | null;

  @ApiProperty({ type: String, nullable: true })
  subtitle: string | null;

  @ApiProperty({ type: String, nullable: true })
  ctaLabel: string | null;
}

export class BannerLinkTargetTitleResponse {
  @ApiProperty({ enum: E_Locale, enumName: 'E_Locale' })
  languageCode: E_Locale;

  @ApiProperty()
  title: string;
}

// A collection a slide can link to (content editors can't read /admin/collections)
export class BannerLinkTargetResponse {
  @ApiProperty({ description: 'Collection id (uuid)' })
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({
    description: 'Hidden collections are listed but not shown in the hero',
  })
  isActive: boolean;

  @ApiProperty({
    type: [BannerLinkTargetTitleResponse],
    description: 'uk first',
  })
  translations: BannerLinkTargetTitleResponse[];
}

// Everything the CMS edits, hidden and scheduled slides included
export class AdminBannerResponse {
  @ApiProperty({ description: 'Banner id (uuid)' })
  id: string;

  @ApiProperty({ enum: E_BannerLinkType, enumName: 'E_BannerLinkType' })
  linkType: E_BannerLinkType;

  @ApiProperty({ type: BannerLinkTargetResponse, nullable: true })
  collection: BannerLinkTargetResponse | null;

  @ApiProperty({ type: String, nullable: true })
  url: string | null;

  @ApiProperty({ type: MediaResponse })
  image: MediaResponse;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ description: 'Hero order, ascending' })
  sortOrder: number;

  @ApiProperty({ type: Date, nullable: true })
  startsAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  endsAt: Date | null;

  @ApiProperty({
    enum: BANNER_STATUSES,
    description:
      'live: on the storefront now (if a linked collection is visible); hidden: switched off; scheduled / expired: outside its dates',
  })
  status: BannerStatus;

  @ApiProperty({ type: [BannerTextResponse], description: 'uk first' })
  translations: BannerTextResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
