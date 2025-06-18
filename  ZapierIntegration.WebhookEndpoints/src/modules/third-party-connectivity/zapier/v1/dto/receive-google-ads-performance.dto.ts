import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class ReceiveGoogleAdsPerformanceDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string; // Google Ads Campaign ID

  @IsDateString()
  @IsNotEmpty()
  date: string; // Date for which the performance data is reported (YYYY-MM-DD)

  @IsNumber()
  @Min(0)
  impressions: number;

  @IsNumber()
  @Min(0)
  clicks: number;

  @IsNumber()
  @Min(0)
  cost: number; // In the currency of the Google Ads account

  @IsNumber()
  @Min(0)
  conversions: number;

  @IsString()
  @IsOptional()
  merchantZapierUrl?: string; // Optional: URL if this performance data should trigger a specific merchant Zap

  // Add other relevant performance metrics (e.g., adGroupId, adId, specific conversion actions)
}