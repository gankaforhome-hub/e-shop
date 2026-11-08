import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class BannerOrderItemDto {
  @ApiProperty({ description: 'Collection id', format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'New position in the hero', minimum: 0 })
  @IsInt()
  @Min(0)
  bannerSortOrder: number;
}

export class BannerOrderDto {
  @ApiProperty({
    description: 'Collections with their new hero positions',
    type: [BannerOrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ArrayUnique((item: BannerOrderItemDto) => item?.id, {
    message: 'items must not repeat an id',
  })
  @ValidateNested({ each: true })
  @Type(() => BannerOrderItemDto)
  items: BannerOrderItemDto[];
}
