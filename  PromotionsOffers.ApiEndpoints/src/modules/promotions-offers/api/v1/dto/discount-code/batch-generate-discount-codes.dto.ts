import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';
import { CreateDiscountCodeDto } from './create-discount-code.dto';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class BatchGenerateDiscountCodesDto extends OmitType(CreateDiscountCodeDto, [
  'codePattern',
  'codes',
  'name', // Name is part of PromotionBaseDto, but for batch, batchName is used.
  'description', // Description is part of PromotionBaseDto, but for batch, batchDescription is used.
] as const) {

  @ApiPropertyOptional({ description: 'Name for the batch of discount codes (e.g., "Summer Sale 2024 Codes").' })
  @IsString()
  @IsOptional()
  batchName?: string;

  @ApiPropertyOptional({ description: 'Description for the batch of discount codes.' })
  @IsString()
  @IsOptional()
  batchDescription?: string;
  
  @ApiProperty({ description: 'Number of unique codes to generate.', minimum: 1, maximum: 10000 })
  @IsInt()
  @Min(1)
  @Max(10000) // Practical limit for a single request
  quantity: number;

  @ApiPropertyOptional({ description: 'Prefix for generated codes.' })
  @IsString()
  @IsOptional()
  codePrefix?: string;

  @ApiPropertyOptional({ description: 'Suffix for generated codes.' })
  @IsString()
  @IsOptional()
  codeSuffix?: string;

  @ApiPropertyOptional({
    description: 'Length of the random part of the code (excluding prefix and suffix).',
    minimum: 4,
    maximum: 32,
    default: 8,
  })
  @IsInt()
  @Min(4)
  @Max(32)
  @IsOptional()
  codeLength?: number = 8;

  @ApiPropertyOptional({
    description: "Character set to use for code generation, e.g., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'. Defaults to alphanumeric.",
  })
  @IsString()
  @IsOptional()
  characterSet?: string;
}