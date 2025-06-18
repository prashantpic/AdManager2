import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class BrandedCardDesignSpecificationsDto {
  @ApiProperty({
    description: 'Recommended dimensions for the card design, e.g., "1000x500px".',
    example: '1000x500px',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  recommendedDimensions?: string;

  @ApiProperty({
    description: 'Supported file formats for the card design.',
    example: ['JPG', 'PNG'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  supportedFileFormats?: string[];

  @ApiProperty({
    description: 'Maximum file size in megabytes (MB).',
    example: 5,
    required: false,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxFileSizeMB?: number;
}