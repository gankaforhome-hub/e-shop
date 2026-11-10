import { Audiences, CurrentUser, UUIDParam } from '@common/decorators';
import { StaffGuard, StaffRoles } from '@modules/staff/guards/staff.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';
import { AdminBannerService } from './admin-banner.service';
import {
  BannerOrderDto,
  CreateBannerDto,
  UpdateBannerDto,
} from './dto/banner.dto';
import {
  AdminBannerResponse,
  BannerLinkTargetResponse,
} from './responses/banner.response';

@ApiTags('🖼️ banners (CMS)')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Not an approved staff member with a key-confirmed session',
})
@Audiences(E_AuthAudience.CMS)
@UseGuards(StaffGuard)
@StaffRoles(E_StaffRole.CONTENT_EDITOR, E_StaffRole.CATALOG_MANAGER)
@Controller('admin/banners')
export class AdminBannerController {
  constructor(private readonly service: AdminBannerService) {}

  @Get()
  @ApiOperation({
    summary: 'All banners in hero order, hidden and scheduled included',
  })
  @ApiOkResponse({ type: [AdminBannerResponse] })
  findAll(): Promise<AdminBannerResponse[]> {
    return this.service.findAll();
  }

  //COMMENT declared before :id, so "link-targets" is not parsed as an id
  @Get('link-targets')
  @ApiOperation({ summary: 'Collections a banner can link to' })
  @ApiOkResponse({ type: [BannerLinkTargetResponse] })
  linkTargets(): Promise<BannerLinkTargetResponse[]> {
    return this.service.linkTargets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'One banner with every translation' })
  @ApiOkResponse({ type: AdminBannerResponse })
  @ApiNotFoundResponse({ description: 'Unknown banner' })
  findOne(@UUIDParam('id') id: string): Promise<AdminBannerResponse> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a banner',
    description: 'It goes last in the hero and stays hidden unless isActive',
  })
  @ApiCreatedResponse({ type: AdminBannerResponse })
  @ApiBadRequestResponse({
    description:
      'Invalid body, link not matching linkType, unknown media or collection, URL slide without a uk title, endsAt not after startsAt',
  })
  create(
    @Body() dto: CreateBannerDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<AdminBannerResponse> {
    return this.service.create(dto, { actorId, ip });
  }

  //COMMENT declared before :id, so "order" is not parsed as an id
  @Patch('order')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Reorder the hero',
    description:
      'Every banner id in the new order; sortOrder becomes the 1-based position',
  })
  @ApiNoContentResponse({ description: 'Saved' })
  @ApiBadRequestResponse({
    description: 'The list misses, repeats or adds a banner',
  })
  setOrder(
    @Body() dto: BannerOrderDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return this.service.setOrder(dto, { actorId, ip });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Change a banner',
    description:
      'Omitted fields stay. Switching linkType clears the other link field. Listed translations are replaced whole',
  })
  @ApiOkResponse({ type: AdminBannerResponse })
  @ApiBadRequestResponse({ description: 'As for create' })
  @ApiNotFoundResponse({ description: 'Unknown banner' })
  update(
    @UUIDParam('id') id: string,
    @Body() dto: UpdateBannerDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<AdminBannerResponse> {
    return this.service.update(id, dto, { actorId, ip });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a banner',
    description: 'Its texts go too; the image stays in the media library',
  })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({ description: 'Unknown banner' })
  remove(
    @UUIDParam('id') id: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return this.service.remove(id, { actorId, ip });
  }
}
