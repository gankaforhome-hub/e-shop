import { SkipAuth } from '@common/decorators';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { E_Locale } from '@prisma/client';
import { BannerService } from './banner.service';
import { BannerQueryDto } from './dto/banner.dto';
import { BannerResponse } from './responses/banner.response';

@ApiTags('🖼️ banners')
@SkipAuth()
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @ApiOperation({
    summary: 'Home hero slides',
    description:
      'Switched on, inside their dates, a linked collection visible; in hero order',
  })
  @ApiOkResponse({ type: [BannerResponse] })
  findLive(@Query() { lang }: BannerQueryDto): Promise<BannerResponse[]> {
    return this.bannerService.findLive(lang ?? E_Locale.uk);
  }
}
