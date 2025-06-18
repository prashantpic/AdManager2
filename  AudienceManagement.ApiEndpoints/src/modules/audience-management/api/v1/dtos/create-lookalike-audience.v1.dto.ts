import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min, Max, IsEnum } from 'class-validator';

// Assuming ISO 3166-1 alpha-2 country codes
export enum SupportedCountryCode {
  US = 'US',
  CA = 'CA',
  GB = 'GB',
  SA = 'SA',
  // ... add more as needed
}

class LookalikeSpecDto {
  @ApiProperty({ description: 'Target Ad Network ID for this specific lookalike configuration.' })
  @IsString()
  @IsNotEmpty()
  adNetworkId: string;

  @ApiProperty({ enum: SupportedCountryCode, description: 'Target country code for the lookalike audience (e.g., "SA", "US").' })
  @IsEnum(SupportedCountryCode)
  @IsNotEmpty()
  countryCode: SupportedCountryCode;

  @ApiPropertyOptional({ type: Number, description: 'Desired lookalike audience size percentage (e.g., 1 for 1%). Ad network specific interpretation.' , minimum: 1, maximum: 10})
  @IsNumber()
  @Min(1)
  @Max(10) // Example range, adjust based on ad network capabilities
  @IsOptional()
  sizePercentage?: number;
}

export class CreateLookalikeAudienceRequestDto {
  @ApiProperty({ description: 'Name of the lookalike audience.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Optional description for the audience.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID of an existing custom audience in Ad Manager to use as the source.' })
  @IsString()
  @IsNotEmpty()
  sourceAudienceId: string; // Internal Ad Manager Audience ID

  @ApiProperty({ type: [LookalikeSpecDto], description: 'Array of ad network-specific lookalike specifications. Each spec defines creation parameters for one ad network.'})
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LookalikeSpecDto)
  lookalikeSpecifications: LookalikeSpecDto[];
}