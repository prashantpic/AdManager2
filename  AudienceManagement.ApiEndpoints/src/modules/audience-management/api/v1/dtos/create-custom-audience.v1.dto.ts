import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsArray, ArrayNotEmpty, IsObject, ValidateNested, ValidateIf, IsBoolean } from 'class-validator';

class DataProcessingOptionsDto {
  @ApiPropertyOptional({ description: 'Fields to hash before sending to ad networks, if sourceType is CUSTOMER_LIST_UPLOAD' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  piiHashingFields?: string[];

  @ApiProperty({ description: 'Confirms necessary consents are obtained for processing this data.' })
  @IsBoolean()
  @IsNotEmpty()
  consentVerified: boolean;
}

export class CreateCustomAudienceRequestDto {
  @ApiProperty({ description: 'Name of the custom audience.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Optional description for the audience.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD'], description: 'Source type for the custom audience.' })
  @IsIn(['PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD'])
  @IsNotEmpty()
  sourceType: 'PLATFORM_DATA_SEGMENT' | 'CUSTOMER_LIST_UPLOAD';

  @ApiPropertyOptional({ description: 'ID of the platform data segment, required if sourceType is PLATFORM_DATA_SEGMENT.' })
  @IsString()
  @ValidateIf(o => o.sourceType === 'PLATFORM_DATA_SEGMENT')
  @IsNotEmpty()
  @IsOptional()
  platformDataSourceId?: string;

  @ApiPropertyOptional({ description: 'Key to a pre-uploaded file (e.g., S3 key) containing customer data, required if sourceType is CUSTOMER_LIST_UPLOAD.' })
  @IsString()
  @ValidateIf(o => o.sourceType === 'CUSTOMER_LIST_UPLOAD')
  @IsNotEmpty()
  @IsOptional()
  customerListFileKey?: string;

  @ApiProperty({ type: [String], description: 'Array of Ad Network IDs to target with this audience.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  targetAdNetworkIds: string[];
  
  @ApiProperty({ type: DataProcessingOptionsDto, description: 'Options for data processing and compliance.'})
  @IsObject()
  @ValidateNested()
  @Type(() => DataProcessingOptionsDto)
  @IsNotEmpty()
  dataProcessingOptions: DataProcessingOptionsDto;
}