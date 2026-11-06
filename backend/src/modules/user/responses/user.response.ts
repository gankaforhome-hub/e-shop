import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  @ApiProperty({ description: 'The id of the user' })
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @Exclude()
  password: string | null;

  @ApiProperty({ description: 'The roles of the user' })
  roles: $Enums.E_UserRole[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
