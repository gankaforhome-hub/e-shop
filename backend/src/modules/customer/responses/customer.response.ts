import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '@prisma/client';

//COMMENT what the storefront may show; no password hash, no internal state
export class CustomerResponse {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) firstName: string | null;
  @ApiProperty({ nullable: true }) lastName: string | null;
  @ApiProperty({ nullable: true, description: 'E.164' }) phone: string | null;
  @ApiProperty({ nullable: true }) emailVerifiedAt: Date | null;
  @ApiProperty({ nullable: true }) phoneVerifiedAt: Date | null;
  @ApiProperty({ description: 'Current news-and-offers choice' })
  marketingEmail: boolean;
  @ApiProperty({ description: 'Has a password (false: Google only)' })
  hasPassword: boolean;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.email = customer.email;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.phone = customer.phone;
    this.emailVerifiedAt = customer.emailVerifiedAt;
    this.phoneVerifiedAt = customer.phoneVerifiedAt;
    this.marketingEmail = customer.marketingEmail;
    this.hasPassword = customer.password !== null;
  }
}
