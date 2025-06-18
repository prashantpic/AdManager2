import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommissionRuleDto } from '../commissions/create-commission-rule.dto';
import { DEFAULT_COOKIE_WINDOW_DAYS } from '../../../constants/affiliate.constants';

export class CreateProgramDto {
  @ApiProperty({
    description: 'The name of the affiliate program.',
    example: 'Summer Sale Affiliate Program',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the affiliate program.',
    example: 'Promote our summer collection and earn high commissions!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Cookie window in days for tracking affiliate referrals.',
    example: 30,
    default: DEFAULT_COOKIE_WINDOW_DAYS,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  cookieWindowDays?: number = DEFAULT_COOKIE_WINDOW_DAYS;

  @ApiProperty({
    description: 'List of commission rules for this program.',
    type: () => [CreateCommissionRuleDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommissionRuleDto)
  commissionRules: CreateCommissionRuleDto[];
}