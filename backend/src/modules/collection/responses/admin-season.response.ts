import { ApiProperty } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';

export class AdminSeasonTranslationResponse {
  @ApiProperty({
    description: 'Language of this label',
    enum: E_Locale,
    enumName: 'E_Locale',
  })
  languageCode: E_Locale;

  @ApiProperty({ description: 'Season name' })
  label: string;
}

// Everything the CMS edits, labels in every language
export class AdminSeasonResponse {
  @ApiProperty({ description: 'Season slug, the catalog filter value' })
  slug: string;

  @ApiProperty({ description: 'Position in the filter, ascending' })
  sortOrder: number;

  @ApiProperty({
    description: 'Labels in every language, uk first',
    type: [AdminSeasonTranslationResponse],
  })
  translations: AdminSeasonTranslationResponse[];

  @ApiProperty({
    description:
      'Collections in this season; only an unused season can be deleted',
  })
  collectionCount: number;

  @ApiProperty({ description: 'Creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'Last change time' })
  updatedAt: Date;
}
