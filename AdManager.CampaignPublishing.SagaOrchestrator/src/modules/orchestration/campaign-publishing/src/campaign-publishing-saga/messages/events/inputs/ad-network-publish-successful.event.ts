import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class AdNetworkPublishSuccessfulEvent {
  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly campaignId: string;

  @IsString()
  @IsNotEmpty()
  readonly adNetworkId: string;

  @IsString()
  @IsNotEmpty()
  readonly externalCampaignId: string;
}