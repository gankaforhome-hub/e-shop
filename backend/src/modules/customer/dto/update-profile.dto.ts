import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

//COMMENT the customer's own profile; omitted fields stay as they are
export class UpdateProfileDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiPropertyOptional({ example: 'Olena' })
  firstName?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiPropertyOptional({ example: 'Kovalenko' })
  lastName?: string;

  //COMMENT E.164, or null to remove it
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @Matches(/^\+[1-9]\d{7,14}$/, { message: 'phone must be in E.164 format' })
  @IsPhoneNumber(undefined, { message: 'phone is not a valid number' })
  @ApiPropertyOptional({ example: '+380671234567', nullable: true })
  phone?: string | null;

  //COMMENT news and offers: true gives the consent now, false withdraws it
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  marketingConsent?: boolean;
}
