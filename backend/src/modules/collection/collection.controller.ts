import { SkipAuth } from '@common/decorators';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';
import { CollectionService } from './collection.service';
import { CollectionQueryDto } from './dto';
import { CollectionResponse, SeasonResponse } from './responses';

@ApiTags('🏺 collections')
@SkipAuth()
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @ApiOperation({ summary: 'Active collections, in display order' })
  @ApiOkResponse({ type: [CollectionResponse] })
  findAll(@Query() { lang }: CollectionQueryDto) {
    return this.collectionService.findAll(lang ?? E_Locale.uk);
  }

  //COMMENT banners and seasons are declared before :slug, so they are not read as slugs
  @Get('banners')
  @ApiOperation({
    summary: 'Home hero slides',
    description:
      'Active collections with inBanner, ordered by bannerSortOrder, then sortOrder',
  })
  @ApiOkResponse({ type: [CollectionResponse] })
  findBanners(@Query() { lang }: CollectionQueryDto) {
    return this.collectionService.findBanners(lang ?? E_Locale.uk);
  }

  @Get('seasons')
  @ApiOperation({ summary: 'Seasons for the catalog filter' })
  @ApiOkResponse({ type: [SeasonResponse] })
  findSeasons(@Query() { lang }: CollectionQueryDto) {
    return this.collectionService.findSeasons(lang ?? E_Locale.uk);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'One active collection' })
  @ApiParam({ name: 'slug', description: 'Collection slug', example: 'agro' })
  @ApiOkResponse({ type: CollectionResponse })
  @ApiNotFoundResponse({ description: 'Unknown or inactive collection' })
  findBySlug(
    @Param('slug') slug: string,
    @Query() { lang }: CollectionQueryDto,
  ) {
    return this.collectionService.findBySlug(slug, lang ?? E_Locale.uk);
  }
}
