import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUrl,
  IsUUID,
  IsOptional,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new ad within an ad set.
 */
export class CreateAdDto {
  @ApiProperty({
    description: 'UUID v4 of the ad creative to be used for this ad.',
    example: 'c4e9f7a8-1b2c-3d4e-5f6a-7b8c9d0e1f2a',
  })
  @IsUUID('4', { message: 'Ad creative ID must be a valid UUID v4.' })
  @IsNotEmpty({ message: 'Ad creative ID must be provided.' })
  adCreativeId: string;

  @ApiProperty({
    description: 'Name of the ad.',
    example: 'Ad for Summer Collection - Variant A',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Destination URL where the user will be redirected upon clicking the ad.',
    example: 'https://example.com/products/summer-collection-item-123',
  })
  @IsUrl({}, { message: 'Destination URL must be a valid URL.' })
  @IsNotEmpty({ message: 'Destination URL must be provided.' })
  destinationUrl: string;

  @ApiPropertyOptional({
    description: 'Optional UUID v4 of a promotion to associate with this ad.',
    example: 'p1r2o3m4-o5t6-i7o8-n9a0-b1c2d3e4f5g6',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Promotion ID must be a valid UUID v4 if provided.' })
  promotionId?: string;
}