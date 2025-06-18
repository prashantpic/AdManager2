import { ApiProperty } from '@nestjs/swagger';
import { BrandedCardDesignSpecificationsDto } from '../common/branded-card-design-specifications.dto';

/**
 * @class BrandedCardDesignDto
 * @namespace AdManager.GiftOptions.Api.V1.Dtos.Response
 * @description Represents a branded card design.
 */
export class BrandedCardDesignDto {
  @ApiProperty({
    description: 'The unique identifier for the branded card design.',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "The merchant's unique identifier.",
    type: String,
  })
  merchantId: string;

  @ApiProperty({
    description: 'The name of the branded card design.',
    type: String,
  })
  designName: string;

  @ApiProperty({
    description: 'The URL to access the uploaded design image.',
    type: String,
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Indicates if this design is the default for the merchant.',
    type: Boolean,
  })
  isDefault: boolean;

  @ApiProperty({
    description: 'Merchant-defined specifications for the branded card design.',
    type: () => BrandedCardDesignSpecificationsDto,
  })
  specifications: BrandedCardDesignSpecificationsDto;

  @ApiProperty({
    description: 'The date and time when the design was created.',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the design was last updated.',
    type: Date,
  })
  updatedAt: Date;
}