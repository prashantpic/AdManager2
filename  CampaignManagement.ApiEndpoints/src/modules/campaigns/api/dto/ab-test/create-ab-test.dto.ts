import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ABTestElementTypeEnum } from '../../common/enums/ab-test-element-type.enum';
import { ABTestVariationDto } from './ab-test-variation.dto'; // Assuming this DTO is defined and available

/**
 * Data Transfer Object for creating a new A/B test.
 */
export class CreateABTestDto {
  @ApiProperty({
    description: 'UUID v4 of the campaign this A/B test belongs to.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Campaign ID must be a valid UUID v4.' })
  @IsNotEmpty({ message: 'Campaign ID must be provided.' })
  campaignId: string;

  @ApiProperty({
    description: 'Name of the A/B test.',
    example: 'Homepage Headline Test - Summer 2024',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Type of the campaign element being tested.',
    enum: ABTestElementTypeEnum,
    example: ABTestElementTypeEnum.HEADLINE,
  })
  @IsEnum(ABTestElementTypeEnum, { message: 'Test element type must be a valid ABTestElementTypeEnum value.' })
  @IsNotEmpty({ message: 'Test element type must be provided.' })
  testElementType: ABTestElementTypeEnum;

  @ApiProperty({
    description: 'Array of variations for the A/B test. Must contain at least two variations.',
    type: () => [ABTestVariationDto],
    example: [
      { name: 'Variation A - Original Headline', elementValue: 'Welcome to Our Store!' },
      { name: 'Variation B - Benefit-Driven Headline', elementValue: 'Shop Smarter, Save Bigger!' },
    ],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'An A/B test must have at least two variations.' })
  @ValidateNested({ each: true })
  @Type(() => ABTestVariationDto)
  variations: ABTestVariationDto[];
}