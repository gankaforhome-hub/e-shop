import { Audiences, CurrentUser, UUIDParam } from '@common/decorators';
import { UPLOAD_THROTTLE } from '@config';
import { StaffGuard, StaffRoles } from '@modules/staff/guards/staff.guard';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiQuery,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';
import { type Response } from 'express';
import type {} from 'multer'; // Express.Multer.File
import { UpdateMediaDto, UploadMediaDto } from './dto';
import {
  MEDIA_ALT_MAX_LENGTH,
  MEDIA_MAX_UPLOAD_BYTES,
  MEDIA_PAGE_DEFAULT_TAKE,
  MEDIA_PAGE_MAX_TAKE,
} from './media.constants';
import { MediaService } from './media.service';
import { MediaListResponse, MediaResponse } from './responses';

@ApiTags('🖼️ media library (CMS)')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Not an active staff member (a member with a key must confirm the session with it)',
})
@Audiences(E_AuthAudience.CMS)
@UseGuards(StaffGuard)
@StaffRoles(E_StaffRole.CATALOG_MANAGER, E_StaffRole.CONTENT_EDITOR)
@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Throttle(UPLOAD_THROTTLE)
  //COMMENT memory storage (no dest); utf8 keeps Cyrillic file names readable
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MEDIA_MAX_UPLOAD_BYTES, files: 1, fields: 2 },
      defParamCharset: 'utf8',
    }),
  )
  @ApiOperation({
    summary: 'Upload an image',
    description:
      'JPEG, PNG, WebP or AVIF up to 10 MB. Stored as WebP variants up to 1920 px. ' +
      'The same file again returns the existing media with 200.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The image file',
        },
        alt: {
          type: 'string',
          maxLength: MEDIA_ALT_MAX_LENGTH,
          description: 'Alternative text',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'New media', type: MediaResponse })
  @ApiOkResponse({ description: 'Already uploaded', type: MediaResponse })
  @ApiPayloadTooLargeResponse({ description: 'File over 10 MB' })
  @ApiUnsupportedMediaTypeResponse({
    description: 'Not a supported still image (SVG, GIF, animation, HEIC…)',
  })
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() { alt }: UploadMediaDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MediaResponse> {
    const { media, created } = await this.mediaService.upload(file, alt, {
      actorId,
      ip,
    });
    res.status(created ? HttpStatus.CREATED : HttpStatus.OK);
    return media;
  }

  @Get()
  @ApiOperation({ summary: 'Media library, newest first' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Items to skip, default 0',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: `Page size, 1 to ${MEDIA_PAGE_MAX_TAKE}, default ${MEDIA_PAGE_DEFAULT_TAKE}`,
  })
  @ApiOkResponse({ type: MediaListResponse })
  @ApiBadRequestResponse({ description: 'skip or take out of range' })
  findPage(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(MEDIA_PAGE_DEFAULT_TAKE), ParseIntPipe)
    take: number,
  ): Promise<MediaListResponse> {
    return this.mediaService.findPage(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'One media' })
  @ApiOkResponse({ type: MediaResponse })
  @ApiNotFoundResponse({ description: 'Unknown media' })
  findOne(@UUIDParam('id') id: string): Promise<MediaResponse> {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Change alt text, focal point or crop' })
  @ApiOkResponse({ type: MediaResponse })
  @ApiNotFoundResponse({ description: 'Unknown media' })
  update(
    @UUIDParam('id') id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<MediaResponse> {
    return this.mediaService.update(id, dto, { actorId, ip });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media and its files' })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiNotFoundResponse({ description: 'Unknown media' })
  @ApiConflictResponse({
    description: 'The media is in use (collection cover or banner)',
  })
  remove(
    @UUIDParam('id') id: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<void> {
    return this.mediaService.remove(id, { actorId, ip });
  }
}
