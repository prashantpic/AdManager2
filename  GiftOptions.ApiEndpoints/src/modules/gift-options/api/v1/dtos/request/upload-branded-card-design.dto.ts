import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BrandedCardDesignSpecificationsDto } from '../common/branded-card-design-specifications.dto';

/**
 * @class UploadBrandedCardDesignDto
 * @namespace AdManager.GiftOptions.Api.V1.Dtos.Request
 * @description Payload for uploading a new branded card design.
 */
export class UploadBrandedCardDesignDto {
  @ApiProperty({
    description: 'Name of the branded card design.',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  designName: string;

  @ApiPropertyOptional({
    description:
      'Whether this design should be set as the default design for the merchant.',
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Merchant-defined specifications for the branded card design.',
    type: () => BrandedCardDesignSpecificationsDto,
  })
  @ValidateNested()
  @Type(() => BrandedCardDesignSpecificationsDto)
  @IsOptional()
  specifications?: BrandedCardDesignSpecificationsDto;
}