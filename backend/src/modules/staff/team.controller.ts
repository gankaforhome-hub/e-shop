import { Audiences, CurrentUser, UUIDParam } from '@common/decorators';
import { STRICT_THROTTLE } from '@config';
import { IAuthUser } from '@modules/auth/interfaces';
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
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { E_AuthAudience, E_StaffRole } from '@prisma/client';
import { ChangeStaffRoleDto, InviteStaffDto } from './dto/team.dto';
import { StaffGuard, StaffRoles } from './guards/staff.guard';
import { TeamMemberResponse } from './responses/team-member.response';
import { TeamService } from './team.service';

@ApiTags('👥 team (CMS)')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description:
    'Not an approved ADMIN, or the target is an ADMIN / ROOT / yourself (only a root manages an ADMIN)',
})
@Audiences(E_AuthAudience.CMS)
@UseGuards(StaffGuard)
@StaffRoles(E_StaffRole.ADMIN)
@Controller('admin/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Every staff member, newest first' })
  @ApiOkResponse({ type: [TeamMemberResponse] })
  list(@CurrentUser() actor: IAuthUser): Promise<TeamMemberResponse[]> {
    return this.teamService.list(actor);
  }

  @Throttle(STRICT_THROTTLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('invite')
  @ApiOperation({
    summary: 'Invite by email',
    description:
      'Creates the account when the address is new and sends a link (7 days) to set the password. The role is approved at once. Inviting again renews the link of an invited or revoked member.',
  })
  @ApiAcceptedResponse({ description: 'The invitation is sent' })
  @ApiConflictResponse({ description: 'Already an active staff member' })
  async invite(
    @Body() { email, role }: InviteStaffDto,
    @CurrentUser() actor: IAuthUser,
    @Ip() ip: string,
  ): Promise<void> {
    await this.teamService.invite(actor, email, role, { ip });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':userId')
  @ApiOperation({ summary: 'Change the role' })
  @ApiNoContentResponse({ description: 'Saved' })
  @ApiBadRequestResponse({ description: 'The access is revoked' })
  @ApiNotFoundResponse({ description: 'Not a staff member' })
  async changeRole(
    @UUIDParam('userId') userId: string,
    @Body() { role }: ChangeStaffRoleDto,
    @CurrentUser() actor: IAuthUser,
    @Ip() ip: string,
  ): Promise<void> {
    await this.teamService.changeRole(actor, userId, role, { ip });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  @ApiOperation({
    summary: 'Revoke the access',
    description:
      'Ends every session and voids the invitation at once. The account stays.',
  })
  @ApiNoContentResponse({ description: 'Revoked' })
  @ApiNotFoundResponse({ description: 'Not a staff member' })
  async revoke(
    @UUIDParam('userId') userId: string,
    @CurrentUser() actor: IAuthUser,
    @Ip() ip: string,
  ): Promise<void> {
    await this.teamService.revoke(actor, userId, { ip });
  }
}
