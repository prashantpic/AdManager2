import { IsUUID, IsArray, ValidateNested, IsIn, IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum PublishedAdNetworkStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}
export class PublishedAdNetworkInfo {
  @IsString()
  @IsNotEmpty()
  adNetworkId: string;

  @IsString()
  @IsNotEmpty()
  externalCampaignId: string;

  @IsEnum(PublishedAdNetworkStatus)
  status: PublishedAdNetworkStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CampaignPublishingCompletedEvent {
  @IsUUID()
  readonly sagaInstanceId: string;

  @IsUUID()
  readonly campaignId: string;

  @IsUUID()
  readonly merchantId: string;

  @IsIn(['COMPLETED', 'PARTIALLY_COMPLETED'])
  readonly finalStatus: 'COMPLETED' | 'PARTIALLY_COMPLETED';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublishedAdNetworkInfo)
  readonly publishedAdNetworks: PublishedAdNetworkInfo[];
}