import { IsString, IsNotEmpty, IsObject, IsOptional, ValidateNested, IsDateString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

// Define a more specific type for formData if possible, or use Record<string, any>
// For example, if you expect specific fields like 'email', 'name':
// class LeadFormDataDto {
//   @IsEmail()
//   @IsOptional()
//   email?: string;
//
//   @IsString()
//   @IsOptional()
//   name?: string;
//
//   // Add other common lead form fields with validation
// }

export class ReceiveGoogleAdsLeadDto {
  @IsString()
  @IsNotEmpty()
  leadId: string; // Unique ID for the lead from Google Ads or Zapier

  @IsString()
  @IsNotEmpty()
  campaignId: string; // Google Ads Campaign ID

  @IsString()
  @IsOptional()
  adGroupId?: string; // Google Ads Ad Group ID

  @IsString()
  @IsOptional()
  adId?: string; // Google Ads Ad ID (Creative ID)

  @IsObject()
  @IsNotEmpty()
  // @ValidateNested() // Uncomment if using a nested DTO like LeadFormDataDto
  // @Type(() => LeadFormDataDto) // Uncomment if using a nested DTO
  formData: Record<string, any>; // Raw form data submitted by the user

  @IsDateString()
  @IsNotEmpty()
  timestamp: string; // ISO 8601 timestamp of when the lead was generated/received

  @IsString()
  @IsOptional()
  merchantZapierUrl?: string; // Optional: URL if this lead should trigger a specific merchant Zap

  // Add any other relevant fields passed by Zapier
}