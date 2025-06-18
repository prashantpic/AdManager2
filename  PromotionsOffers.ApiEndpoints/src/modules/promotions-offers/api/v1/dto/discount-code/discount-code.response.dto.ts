import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateIf } from 'class-validator';
import { PromotionBaseResponseDto } from '../common/promotion-base-response.dto';
import { DiscountCodeType, DiscountCodeUsageLimitType } from '../../constants/promotion.enums';

export class DiscountCodeResponseDto extends PromotionBaseResponseDto {
  @ApiProperty({ description: 'The actual discount code string.' })
  @IsString()
  code: string;

  @ApiProperty({ default: 0, description: 'Number of times the discount code has been used.' })
  @IsInt()
  @Min(0)
  timesUsed: number;

  @ApiProperty()
  @IsBoolean()
  isUniquePerMerchant: boolean;

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