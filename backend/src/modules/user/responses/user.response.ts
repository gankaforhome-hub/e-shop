import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  @ApiProperty({ description: 'The id of the user' })
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @Exclude()
  password: string | null;

  @ApiProperty({ description: 'The name of the user', nullable: true })
  name: string | null;

  @ApiProperty({
    description: 'When the email was verified',
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @ApiProperty({ description: 'Phone in E.164', nullable: true })
  phone: string | null;

  @ApiProperty({ description: 'When the phone was verified', nullable: true })
  phoneVerifiedAt: Date | null;

  //COMMENT the Google account id stays on the server
  @Exclude()
  googleSub: string | null;

  @ApiProperty({ description: 'First name', nullable: true })
  firstName: string | null;

  @ApiProperty({ description: 'Last name', nullable: true })
  lastName: string | null;

  @ApiProperty({ description: 'When the terms were accepted', nullable: true })
  termsAcceptedAt: Date | null;

  @ApiProperty({ description: 'Accepted terms version', nullable: true })
  termsVersion: string | null;

  @ApiProperty({
    description: 'When news and offers were allowed; null = not allowed',
    nullable: true,
  })
  marketingConsentAt: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
