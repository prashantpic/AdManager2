import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetAllocationDto } from './budget-allocation.dto'; // Assuming this DTO is defined and available

/**
 * Data Transfer Object for creating a new ad set within a campaign.
 */
export class CreateAdSetDto {
  @ApiProperty({
    description: 'Name of the ad set.',
    example: 'High-Intent Users - Google Search',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Targeting criteria for the ad set. Structure may vary by ad network.',
    example: {
      locations: ['US', 'CA'],
      age_min: 25,
      age_max: 55,
      interests: ['technology', 'gadgets'],
    },
    type: 'object',
  })
  @IsObject()
  @IsNotEmpty()
  targetingCriteria: any;

  @ApiProperty({
    description: 'Bidding strategy for the ad set. Structure may vary by ad network.',
    example: { strategy_type: 'MAX_CONVERSIONS', bid_cap: 5.00 },
    type: 'object',
  })
  @IsObject()
  @IsNotEmpty()
  biddingStrategy: any;

  @ApiProperty({
    description: 'Budget allocation details for the ad set.',
    type: () => BudgetAllocationDto,
  })
  @ValidateNested()
  @Type(() => BudgetAllocationDto)
  @IsNotEmpty()
  budgetAllocation: BudgetAllocationDto;

  @ApiProperty({
    description: 'UUID v4 of the specific ad network this ad set targets. This ID must correspond to one of the campaign\'s targetAdNetworks.',
    example: '123e4567-e89b-12d3-a456-426614174001', // Example Ad Network ID
  })
  @IsUUID('4', { message: 'Ad network ID must be a valid UUID v4.' })
  @IsNotEmpty({ message: 'Ad network ID must be provided.'})
  adNetworkId: string;
}