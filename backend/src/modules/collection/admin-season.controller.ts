import { Audiences, CurrentUser } from '@common/decorators';
import { StaffGuard, StaffRoles } from '@modules/staff/guards/staff.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';
import { AdminSeasonService } from './admin-season.service';
import { CreateSeasonDto, UpdateSeasonDto } from './dto';
import { AdminSeasonResponse } from './responses';

@ApiTags('🏺 seasons (CMS)')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Not an active staff member (a member with a key must confirm the session with it)',
})
@Audiences(E_AuthAudience.CMS)
@UseGuards(StaffGuard)
@StaffRoles(E_StaffRole.CATALOG_MANAGER)
@Controller('admin/seasons')
export class AdminSeasonController {
  constructor(private readonly service: AdminSeasonService) {}

  @Get()
  @ApiOperation({ summary: 'All seasons with labels and usage' })
  @ApiOkResponse({ type: [AdminSeasonResponse] })
  findAll(): Promise<AdminSeasonResponse[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a season' })
  @ApiCreatedResponse({ type: AdminSeasonResponse })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'slug is already taken' })
  create(
    @Body() dto: CreateSeasonDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<AdminSeasonResponse> {
    return this.service.create(dto, { actorId, ip });
  }

  @Patch(':slug')
  @ApiOperation({
    summary: 'Change labels or position',
    description:
      'The slug never changes. Listed labels are created or replaced',
  })
  @ApiParam({ name: 'slug', example: 'winter' })
  @ApiOkResponse({ type: AdminSeasonResponse })
  @ApiNotFoundResponse({ description: 'Unknown season' })
  update(
    @Param('slug') slug: string,
    @Body() dto: UpdateSeasonDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<AdminSeasonResponse> {
    return this.service.update(slug, dto, { actorId, ip });
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an unused season' })
  @ApiParam({ name: 'slug', example: 'winter' })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({ description: 'Unknown season' })
  @ApiConflictResponse({ description: 'Collections still use the season' })
  remove(
    @Param('slug') slug: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return this.service.remove(slug, { actorId, ip });
  }
}
