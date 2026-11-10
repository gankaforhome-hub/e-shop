import { ApiProperty } from '@nestjs/swagger';

export class PublicMediaVariantResponse {
  @ApiProperty({ description: 'Variant width, px' })
  width: number;

  @ApiProperty({ description: 'Variant height, px' })
  height: number;

  @ApiProperty({ description: 'Public URL of the WebP file' })
  src: string;
}

// Storefront shape of an image (collections, banners): no storage keys or upload data
export class PublicMediaResponse {
  @ApiProperty({ description: 'Media id' })
  id: string;

  @ApiProperty({ description: 'Public URL of the largest variant' })
  src: string;

  @ApiProperty({
    description:
      'Alternative text; the localized title of what it shows if unset',
  })
  alt: string;

  @ApiProperty({ description: 'Width of the largest variant, px' })
  width: number;

  @ApiProperty({ description: 'Height of the largest variant, px' })
  height: number;

  @ApiProperty({
    description: '16 px WebP placeholder as a data URL',
    type: String,
    nullable: true,
  })
  blurDataUrl: string | null;

  @ApiProperty({
    description: 'Horizontal focal point, 0 (left) to 1 (right)',
    example: 0.5,
  })
  focalX: number;

  @ApiProperty({
    description: 'Vertical focal point, 0 (top) to 1 (bottom)',
    example: 0.5,
  })
  focalY: number;

  @ApiProperty({
    description: 'CSS object-position derived from the focal point',
    example: '50% 30%',
  })
  objectPosition: string;

  @ApiProperty({
    description: 'All variants, narrowest first',
    type: [PublicMediaVariantResponse],
  })
  variants: PublicMediaVariantResponse[];
}
