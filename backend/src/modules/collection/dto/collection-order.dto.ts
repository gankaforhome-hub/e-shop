import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CollectionOrderDto {
  @ApiProperty({
    description:
      'Every collection id in the new order; sortOrder becomes the 1-based position',
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
