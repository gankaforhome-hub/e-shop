import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MEDIA_ALT_MAX_LENGTH } from '../media.constants';

// The side must end inside the image: offset + size ≤ 1
@ValidatorConstraint({ name: 'FitsInsideImage', async: false })
class FitsInsideImageConstraint implements ValidatorConstraintInterface {
  validate(size: unknown, args: ValidationArguments) {
    const [offsetKey] = args.constraints as [keyof CropDataDto];
    const offset = (args.object as CropDataDto)[offsetKey];
    return (
      typeof size === 'number' &&
      typeof offset === 'number' &&
      offset + size <= 1
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [offsetKey] = args.constraints as [string];
    return `${offsetKey} + ${args.property} must not exceed 1`;
  }
}

export class CropDataDto {
  @ApiProperty({
    description: 'Left edge, fraction of the width',
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  x: number;

  @ApiProperty({
    description: 'Top edge, fraction of the height',
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  y: number;

  @ApiProperty({
    description: 'Crop width, fraction of the width; x + width ≤ 1',
    exclusiveMinimum: true,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Validate(FitsInsideImageConstraint, ['x'])
  width: number;

  @ApiProperty({
    description: 'Crop height, fraction of the height; y + height ≤ 1',
    exclusiveMinimum: true,
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Validate(FitsInsideImageConstraint, ['y'])
  height: number;
}

export class UpdateMediaDto {
  @ApiPropertyOptional({
    description: 'Alternative text; null clears it',
    type: String,
    nullable: true,
    maxLength: MEDIA_ALT_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MEDIA_ALT_MAX_LENGTH)
  alt?: string | null;

  @ApiPropertyOptional({
    description: 'Horizontal focal point, 0 (left) to 1 (right)',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  focalX?: number;

  @ApiPropertyOptional({
    description: 'Vertical focal point, 0 (top) to 1 (bottom)',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  focalY?: number;

  @ApiPropertyOptional({
    description: 'Crop of the original in fractions; null clears it',
    type: CropDataDto,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CropDataDto)
  cropData?: CropDataDto | null;
}
