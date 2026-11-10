import { ApiProperty } from '@nestjs/swagger';

// Prefixed: the storefront shape is PublicMediaVariantResponse
export class AdminMediaVariantResponse {
  @ApiProperty({ description: 'Variant width, px' })
  width: number;

  @ApiProperty({ description: 'Variant height, px' })
  height: number;

  @ApiProperty({ description: 'File size, bytes' })
  size: number;

  @ApiProperty({
    description: 'Storage key, media/<checksum>/<width>.webp',
  })
  key: string;

  @ApiProperty({ description: 'Public URL of the WebP file' })
  publicUrl: string;
}

export class CropDataResponse {
  @ApiProperty({ description: 'Left edge, fraction of the width' })
  x: number;

  @ApiProperty({ description: 'Top edge, fraction of the height' })
  y: number;

  @ApiProperty({ description: 'Crop width, fraction of the width' })
  width: number;

  @ApiProperty({ description: 'Crop height, fraction of the height' })
  height: number;
}

export class MediaResponse {
  @ApiProperty({ description: 'Media id (uuid)' })
  id: string;

  @ApiProperty({ description: 'SHA-256 of the original file, hex' })
  checksum: string;

  @ApiProperty({ description: 'Width of the largest variant, px' })
  width: number;

  @ApiProperty({ description: 'Height of the largest variant, px' })
  height: number;

  @ApiProperty({ description: 'Size of the largest variant, bytes' })
  sizeBytes: number;

  @ApiProperty({
    description: 'All variants, narrowest first',
    type: [AdminMediaVariantResponse],
  })
  variants: AdminMediaVariantResponse[];

  @ApiProperty({
    description: '16 px WebP placeholder as a data URL',
    type: String,
    nullable: true,
  })
  blurDataUrl: string | null;

  @ApiProperty({
    description: 'Alternative text',
    type: String,
    nullable: true,
  })
  alt: string | null;

  @ApiProperty({
    description: 'File name at upload, for the library only',
    type: String,
    nullable: true,
  })
  originalName: string | null;

  @ApiProperty({ description: 'Horizontal focal point, 0..1' })
  focalX: number;

  @ApiProperty({ description: 'Vertical focal point, 0..1' })
  focalY: number;

  @ApiProperty({
    description: 'CSS object-position derived from the focal point',
    example: '50% 30%',
  })
  objectPosition: string;

  @ApiProperty({
    description: 'Crop of the original in fractions',
    type: CropDataResponse,
    nullable: true,
  })
  cropData: CropDataResponse | null;

  @ApiProperty({ description: 'Upload time' })
  createdAt: Date;

  @ApiProperty({ description: 'Last change time' })
  updatedAt: Date;
}

export class MediaListResponse {
  @ApiProperty({ description: 'One page, newest first', type: [MediaResponse] })
  items: MediaResponse[];

  @ApiProperty({ description: 'Number of media in the library' })
  total: number;
}
