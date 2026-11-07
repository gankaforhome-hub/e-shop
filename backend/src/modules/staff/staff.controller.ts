import { Audiences, CurrentUser, UUIDParam } from '@common/decorators';
import { MessageResponse } from '@modules/auth/responses/message.response';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
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
import { EnrollmentCodeResponse } from './responses/enrollment-code.response';
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
    summary: 'grant a role (pending until approved)',
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
    return { message: 'Role granted, waiting for a key and approval' };
  }

  @RequireFreshAssertion('staff.enrollment_code')
  @Post(':userId/enrollment-code')
  @ApiOperation({
    summary: 'create a one-time code for registering a key',
    description:
      'Shown only once. Hand it over outside of email: a mailbox must not be able to add a key.',
  })
  async createEnrollmentCode(
    @UUIDParam('userId') userId: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<EnrollmentCodeResponse> {
    const code = await this.staffService.createEnrollmentCode(userId, {
      actorId,
      ip,
    });
    return { code };
  }

  @RequireFreshAssertion('staff.approve')
  @HttpCode(HttpStatus.OK)
  @Post(':userId/approve')
  @ApiOperation({ summary: 'approve a user who has registered a key' })
  async approve(
    @UUIDParam('userId') userId: string,
    @CurrentUser('id') actorId: string,
    @Ip() ip: string,
  ): Promise<MessageResponse> {
    await this.staffService.approve(userId, { actorId, ip });
    return { message: 'Approved' };
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
