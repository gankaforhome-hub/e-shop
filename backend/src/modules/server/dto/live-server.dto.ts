import { ApiProperty } from '@nestjs/swagger';

export class LiveServerDTO {
  @ApiProperty()
  status: boolean;
}
