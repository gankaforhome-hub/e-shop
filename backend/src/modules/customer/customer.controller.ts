import { CurrentUser, UserAgent } from '@common/decorators';
import { IAuthUser } from '@modules/auth/interfaces';
import {
  Body,
  Controller,
  Get,
  Ip,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { UpdateProfileDto } from './dto';
import { CustomerResponse } from './responses/customer.response';

//COMMENT storefront sessions only (the default audience): staff accounts live elsewhere
@ApiTags('🙎‍♂️ customer')
@ApiBearerAuth()
@Controller('user')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('me')
  @ApiOperation({ summary: 'the signed-in customer' })
  async getMe(@CurrentUser() actor: IAuthUser): Promise<CustomerResponse> {
    const customer = await this.customerService.findById(actor.id);
    if (!customer) {
      throw new NotFoundException();
    }
    return new CustomerResponse(customer);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'update the own profile',
    description:
      'Names, phone (null removes it) and the news-and-offers consent (journaled). Email, password and rights have their own flows.',
  })
  async updateMe(
    @CurrentUser() actor: IAuthUser,
    @Body() dto: UpdateProfileDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  ): Promise<CustomerResponse> {
    return new CustomerResponse(
      await this.customerService.updateProfile(actor, dto, { ip, userAgent }),
    );
  }
}
