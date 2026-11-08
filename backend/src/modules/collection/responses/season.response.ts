import { ApiProperty } from '@nestjs/swagger';

export class CollectionSeasonResponse {
  @ApiProperty({
    description: 'Season slug, the catalog filter value (?season=)',
    example: 'new_year',
  })
  slug: string;

  @ApiProperty({
    description: 'Localized season name; the slug if it has no translation',
    example: 'Новий рік',
  })
  label: string;
}

export class SeasonResponse extends CollectionSeasonResponse {
  @ApiProperty({ description: 'Position in the filter, ascending' })
  sortOrder: number;
}
