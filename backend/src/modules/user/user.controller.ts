import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  // ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// import { PrismaClientExceptionFilter } from '@database/prisma/prisma-client-exception/prisma-client-exception.filter';

import { CreateUserDto, UpdateUserDto } from '@modules/user/dto';
import { UserService } from './user.service';

import { CurrentUser, Roles, UUIDParam } from '@common/decorators';
import { RolesGuard } from '@modules/auth/guards/role.guard';
import { IJwtPayload } from '@modules/auth/interfaces';
import { E_UserRole, User } from '@prisma/client';
import { UUID } from 'crypto';
import { UserResponse } from './responses';

@ApiTags('🙎‍♂️ user service')
@Controller('user')
//decorator for prisma client error handler
// @UseFilters(PrismaClientExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @Roles(E_UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: '🎭 create user' })
  @ApiBody({ type: CreateUserDto })
  // @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto): Promise<User | null> {
    const user = await this.userService.create(createUserDto);
    const responseUser = user ? new UserResponse(user) : null;
    return responseUser;
  }

  //COMMENT endpoint only for admin
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @Roles(E_UserRole.ADMIN)
  @Get()
  async findAll(): Promise<User[] | []> {
    const user = await this.userService.findAll();
    const responseUsers = user?.map(user => new UserResponse(user)) || [];
    return responseUsers;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async getMe(@CurrentUser('id') id: UUID) {
    if (!id) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByIdOrEmail(id);

    const responseUser = user ? new UserResponse(user) : null;
    return responseUser;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: IJwtPayload,
  ): Promise<User | null> {
    const user = await this.userService.findOne(id, actor);
    const responseUser = user ? new UserResponse(user) : null;
    return responseUser;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() actor: IJwtPayload,
  ): Promise<User | null> {
    const user = await this.userService.update(id, updateUserDto, actor);
    const responseUser = user ? new UserResponse(user) : null;
    return responseUser;
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(
    @UUIDParam('id') id: string,
    @CurrentUser() user: IJwtPayload,
  ): Promise<{ id: string } | null> {
    return this.userService.remove(id, user);
  }
}
