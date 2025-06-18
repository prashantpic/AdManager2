import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { CreativeType } from '../../common/enums/creative-type.enum';

/**
 * Data Transfer Object for uploading a new ad creative.
 * This DTO contains metadata for the ad creative. The actual file is sent via multipart/form-data.
 */
export class UploadAdCreativeDto {
  @ApiProperty({
    description: 'Name of the ad creative.',
    example: 'Summer Banner Ad - Version 1',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Type of the ad creative.',
    enum: CreativeType,
    example: CreativeType.IMAGE,
  })
  @IsEnum(CreativeType, { message: 'Creative type must be a valid CreativeType enum value.' })
  @IsNotEmpty({ message: 'Creative type must be provided.' })
  type: CreativeType;

  @ApiProperty({
    description: 'UUID v4 of the ad network for which this creative is intended. This can help in network-specific validations or processing.',
    example: '123e4567-e89b-12d3-a456-426614174001', // Example Ad Network ID
  })
  @IsUUID('4', { message: 'Ad network ID must be a valid UUID v4.' })
  @IsNotEmpty({ message: 'Ad network ID must be provided.' })
  adNetworkId: string;

  @ApiPropertyOptional({
    description: 'Primary text or body copy for the ad creative. Required for TEXT type creatives.',
    example: 'Check out our amazing summer deals!',
  })
  @IsOptional()
  @IsString()
  adCopy?: string;

  @ApiPropertyOptional({
    description: 'Headline for the ad creative. Often used for text ads or as overlay text.',
    example: 'Up to 50% Off Summer Styles!',
  })
  @IsOptional()
  @IsString()
  headline?: string;
}