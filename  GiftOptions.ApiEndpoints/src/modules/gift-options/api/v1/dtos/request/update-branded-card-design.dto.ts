import { ApiPropertyOptional } from '@nestjs/swagger';
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
 * @class UpdateBrandedCardDesignDto
 * @namespace AdManager.GiftOptions.Api.V1.Dtos.Request
 * @description Payload for updating an existing branded card design's metadata.
 */
export class UpdateBrandedCardDesignDto {
  @ApiPropertyOptional({
    description: 'New name for the branded card design.',
    maxLength: 100,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  designName?: string;

  @ApiPropertyOptional({
    description:
      'Whether this design should be set as the default design for the merchant.',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description:
      'Updated merchant-defined specifications for the branded card design.',
    type: () => BrandedCardDesignSpecificationsDto,
  })
  @ValidateNested()
  @Type(() => BrandedCardDesignSpecificationsDto)
  @IsOptional()
  specifications?: BrandedCardDesignSpecificationsDto;
}