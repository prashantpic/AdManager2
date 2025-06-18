import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional, IsNumber, Min, MaxLength, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus } from '../enums/campaign-status.enum';

export enum AdNetwork {
  GOOGLE = 'GOOGLE',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  SNAPCHAT = 'SNAPCHAT',
}

export enum BudgetType {
  DAILY = 'DAILY',
  LIFETIME = 'LIFETIME',
}

export class CampaignDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }) // Assuming currency
  @Min(0)
  budget?: number;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
  
  @IsOptional()
  @IsArray()
  @IsEnum(AdNetwork, { each: true })
  targetAdNetworks?: AdNetwork[];
}

export class AdSetDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  campaignId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEnum(BudgetType)
  budgetType: BudgetType;

  @IsNumber({ maxDecimalPlaces: 2 }) // Assuming currency
  @Min(0)
  budgetAmount: number;
}

export class AdCreativeDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    // This 'type' field is intended for the creative format (e.g., IMAGE, VIDEO).
    // If it's network-specific creative types, AdNetwork enum might be relevant.
    // For now, using a generic string type or a dedicated CreativeType enum.
    // The SDS mentions @IsEnum(AdNetwork), which implies network-specific creative type identification.
    @IsEnum(AdNetwork) 
    type: AdNetwork | string; // Or a more specific CreativeType enum, e.g. CreativeFormat.IMAGE

    @IsString()
    @IsNotEmpty()
    contentUrlOrText: string;
}


export class AdDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  adSetId: string;
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsUUID()
  @IsNotEmpty()
  adCreativeId: string;

  @IsOptional()
  @IsString()
  // @IsUrl() // Consider adding @IsUrl if it must be a URL
  destinationUrl?: string;

  @IsEnum(CampaignStatus) // Or a more specific AdStatus enum if needed
  status: CampaignStatus;
}