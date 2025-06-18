import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class ApproveAffiliateDto {
  @ApiPropertyOptional({
    description: 'A custom tracking code for the affiliate. Must be unique within the program if provided.',
    example: 'AFFILIATE_JOHN_DOE_SUMMER24',
  })
  @IsString()
  @IsOptional()
  customTrackingCode?: string;

  @ApiPropertyOptional({
    description: 'ID of a specific commission rule to assign to this affiliate, overriding program defaults.',
    example: 'c1o2m3r4-u5l6-e7i8-d9a0-bcdefghijklm',
  })
  @IsUUID('4')
  @IsOptional()
  commissionRuleId?: string;
}