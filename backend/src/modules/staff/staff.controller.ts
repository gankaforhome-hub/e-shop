import { Audiences, CurrentUser, UUIDParam } from '@common/decorators';
import { MessageResponse } from '@modules/auth/responses/message.response';
import {
  Body,
  Controller,
  Delete,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { E_AuthAudience } from '@prisma/client';
import { STRICT_THROTTLE } from '@config';
import { GrantStaffRoleDto } from './dto/grant-staff-role.dto';
import {
  FreshAssertionGuard,
  RequireFreshAssertion,
} from './guards/fresh-assertion.guard';
import { RootGuard } from './guards/root.guard';
import { FRESH_ASSERTION_HEADER } from './staff.constants';
import { StaffService } from './staff.service';

@ApiTags('🛡️ staff management (root)')
@ApiBearerAuth()
@ApiHeader({
  name: FRESH_ASSERTION_HEADER,
  required: true,
  description:
    'Base64url JSON of the key signature, requested from POST /auth/cms/webauthn/assertion-options for this action and target.',
})
@Audiences(E_AuthAudience.CMS)
@UseGuards(RootGuard, FreshAssertionGuard)
@Throttle(STRICT_THROTTLE)
@Controller('admin/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @RequireFreshAssertion('staff.grant')
  @Post(':userId')
  @ApiOperation({
    summary: 'grant a role',
    description:
      'The email of the user must be verified. ROOT can not be granted here.',
  })
  async grant(
    @UUIDParam('userId') userId: string,
    @Body() { role }: GrantStaffRoleDto,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<MessageResponse> {
    await this.staffService.grant(userId, role, { actorId, ip });
    return { message: 'Role granted' };
  }

  @RequireFreshAssertion('staff.revoke')
  @Delete(':userId')
  @ApiOperation({
    summary: 'revoke access',
    description: 'Ends every session of the user at once.',
  })
  async revoke(
    @UUIDParam('userId') userId: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<MessageResponse> {
    await this.staffService.revoke(userId, { actorId, ip });
    return { message: 'Access revoked' };
  }
}
