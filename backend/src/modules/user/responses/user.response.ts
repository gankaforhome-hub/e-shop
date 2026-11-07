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

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
