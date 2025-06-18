import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  Min,
  IsInt,
  ValidateIf,
  ArrayMinSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PromotionBaseDto } from '../common/promotion-base.dto';
import { DiscountCodeType, DiscountCodeUsageLimitType } from '../../constants/promotion.enums';

@ValidatorConstraint({ name: 'codeOrPatternProvided', async: false })
export class IsCodeOrPatternProvidedConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto = args.object as CreateDiscountCodeDto;
    // For single creation, one must be provided.
    // This constraint is simplified; "not both" logic for single creation is often handled in service or a more complex validator.
    // Batch generation has different rules (uses BatchGenerateDiscountCodesDto).
    if (args.targetName === CreateDiscountCodeDto.name) { // Ensure this applies only to CreateDiscountCodeDto, not BatchGenerate
        return !!dto.codePattern || (Array.isArray(dto.codes) && dto.codes.length > 0);
    }
    return true; // Pass for other DTOs or if context is different
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either codePattern or codes (with at least 1 code) must be provided for single discount code creation.';
  }
}


export class CreateDiscountCodeDto extends PromotionBaseDto {
  @ApiPropertyOptional({
    description: 'Pattern for generating a single code if not providing specific codes. e.g., SALE{L L N N}. Not for batch generation.',
  })
  @IsString()
  @IsOptional()
  @ValidateIf(o => !o.codes || o.codes.length === 0) // Required if codes is not provided or empty
  codePattern?: string;

  @ApiPropertyOptional({
    description: 'Specific codes to create (usually one for single creation). Mutually exclusive with codePattern for single creation. Max 1 for single creation via this DTO.',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateIf(o => !o.codePattern) // Required if codePattern is not provided
  codes?: string[];

  // Note: Class-level validation: either `codePattern` or `codes` must be provided, but not both for single creation.
  // This is partially handled by @ValidateIf. The "not both" and ensuring `codes` has only one entry for non-batch
  // might require a custom class validator or service-level check.
  // The @Validate(IsCodeOrPatternProvidedConstraint) could be added at class level for "at least one"

  @ApiProperty({ default: true })
  @IsBoolean()
  isUniquePerMerchant: boolean = true;

  @ApiProperty({ enum: DiscountCodeType })
  @IsEnum(DiscountCodeType)
  discountType: DiscountCodeType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumPurchaseAmount?: number;

  @ApiProperty({ enum: DiscountCodeUsageLimitType })
  @IsEnum(DiscountCodeUsageLimitType)
  usageLimitType: DiscountCodeUsageLimitType;

  @ApiPropertyOptional({ description: 'Required if usageLimitType is MULTIPLE_USES' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @ValidateIf(o => o.usageLimitType === DiscountCodeUsageLimitType.MULTIPLE_USES)
  maxUsagePerCode?: number;

  @ApiPropertyOptional({ description: 'Required if usageLimitType is not SINGLE_USE_GLOBALLY' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @ValidateIf(o => o.usageLimitType !== DiscountCodeUsageLimitType.SINGLE_USE_GLOBALLY)
  maxUsagePerCustomer?: number;
}