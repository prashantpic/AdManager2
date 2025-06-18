import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsEnum,
  ArrayMinSize,
  IsNumber,
  Min,
  IsPositive,
  IsISO8601,
  ValidateIf,
} from 'class-validator';
import { AdNetwork } from '../../common/enums/ad-network.enum';
import { CampaignStatus } from '../../common/enums/campaign-status.enum';
import { IsDateGreaterThan } from '../../common/validators/is-date-greater-than.validator';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for creating a new advertising campaign.
 * Contains all necessary fields and validation rules for campaign creation.
 */
export class CreateCampaignDto {
  @ApiProperty({
    description: 'Name of the campaign. Must be unique for the merchant.',
    example: 'Summer Sale 2024',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'List of target advertising networks for the campaign.',
    enum: AdNetwork,
    isArray: true,
    example: [AdNetwork.GOOGLE, AdNetwork.INSTAGRAM],
  })
  @IsArray()
  @IsEnum(AdNetwork, { each: true, message: 'Each target ad network must be a valid AdNetwork enum value.' })
  @ArrayMinSize(1, { message: 'At least one target ad network must be specified.' })
  targetAdNetworks: AdNetwork[];

  @ApiProperty({
    description: 'Total budget allocated for the campaign.',
    example: 1000.50,
    type: Number,
    minimum: 0.01
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Budget must be a number with up to 2 decimal places.'})
  @IsPositive({ message: 'Budget must be a positive number.' })
  @Min(0.01, { message: 'Budget must be at least 0.01.'}) // Assuming budget cannot be zero
  @Type(() => Number)
  budget: number;

  @ApiProperty({
    description: 'Campaign start date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).',
    example: '2024-07-01T00:00:00.000Z',
    type: String,
    format: 'date-time'
  })
  @IsISO8601({}, { message: 'Start date must be a valid ISO 8601 date string.'})
  @Type(() => Date) // Ensure transformation for validation
  startDate: Date;

  @ApiProperty({
    description: 'Campaign end date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Must be after startDate.',
    example: '2024-07-31T23:59:59.000Z',
    type: String,
    format: 'date-time'
  })
  @IsISO8601({}, { message: 'End date must be a valid ISO 8601 date string.'})
  @Type(() => Date) // Ensure transformation for validation
  @IsDateGreaterThan('startDate', {
    message: 'End date must be after start date.',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Initial status of the campaign upon creation.',
    enum: CampaignStatus,
    example: CampaignStatus.DRAFT,
  })
  @IsEnum(CampaignStatus, { message: 'Initial status must be a valid CampaignStatus enum value.'})
  @IsNotEmpty({ message: 'Initial status must be provided.'})
  initialStatus: CampaignStatus;
}