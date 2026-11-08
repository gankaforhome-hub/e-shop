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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';
import { AdminCollectionService } from './admin-collection.service';
import {
  BannerOrderDto,
  CreateCollectionDto,
  UpdateCollectionDto,
} from './dto';
import { AdminCollectionResponse } from './responses';

@ApiTags('🏺 collections (CMS)')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Not an approved staff member with a key-confirmed session',
})
@Audiences(E_AuthAudience.CMS)
@UseGuards(StaffGuard)
@StaffRoles(E_StaffRole.CATALOG_MANAGER)
@Controller('admin/collections')
export class AdminCollectionController {
  constructor(private readonly service: AdminCollectionService) {}

  @Get()
  @ApiOperation({ summary: 'All collections, inactive included' })
  @ApiOkResponse({ type: [AdminCollectionResponse] })
  findAll(): Promise<AdminCollectionResponse[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'One collection with every translation' })
  @ApiOkResponse({ type: AdminCollectionResponse })
  @ApiNotFoundResponse({ description: 'Unknown collection' })
  findOne(@UUIDParam('id') id: string): Promise<AdminCollectionResponse> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a collection' })
  @ApiCreatedResponse({ type: AdminCollectionResponse })
  @ApiBadRequestResponse({
    description:
      'Invalid body, unknown media or season, inBanner without a banner',
  })
  @ApiConflictResponse({ description: 'slug or skuPrefix is already taken' })
  create(
    @Body() dto: CreateCollectionDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<AdminCollectionResponse> {
    return this.service.create(dto, { actorId, ip });
  }

  //COMMENT declared before :id, so "banner-order" is not parsed as an id
  @Patch('banner-order')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Reorder hero slides',
    description:
      'Sets bannerSortOrder of the listed collections in one transaction',
  })
  @ApiNoContentResponse({ description: 'Saved' })
  @ApiBadRequestResponse({ description: 'Invalid body or unknown id' })
  setBannerOrder(
    @Body() dto: BannerOrderDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return this.service.setBannerOrder(dto, { actorId, ip });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Change a collection',
    description:
      'Omitted fields stay as they are. Listed translations are created or replaced whole.',
  })
  @ApiOkResponse({ type: AdminCollectionResponse })
  @ApiBadRequestResponse({
    description:
      'Invalid body, unknown media or season, inBanner without a banner',
  })
  @ApiNotFoundResponse({ description: 'Unknown collection' })
  @ApiConflictResponse({ description: 'slug or skuPrefix is already taken' })
  update(
    @UUIDParam('id') id: string,
    @Body() dto: UpdateCollectionDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<AdminCollectionResponse> {
    return this.service.update(id, dto, { actorId, ip });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a collection',
    description:
      'Its translations go too; its images stay in the media library',
  })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({ description: 'Unknown collection' })
  remove(
    @UUIDParam('id') id: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return this.service.remove(id, { actorId, ip });
  }
}
