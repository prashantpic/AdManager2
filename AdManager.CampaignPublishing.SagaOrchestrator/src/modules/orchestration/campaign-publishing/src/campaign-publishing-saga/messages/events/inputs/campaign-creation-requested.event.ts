import { IsUUID, IsArray, ArrayNotEmpty, IsObject, IsDefined } from 'class-validator';

export class CampaignCreationRequestedEvent {
  @IsUUID()
  readonly campaignId: string;

  @IsUUID()
  readonly merchantId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true, message: 'Each targetAdNetworkId must be a UUID' })
  readonly targetAdNetworkIds: string[];

  @IsUUID()
  readonly productCatalogId: string;

  @IsDefined()
  @IsObject()
  readonly budgetDetails: any; // Structure defined by Billing service contract

  @IsDefined()
  @IsObject()
  readonly campaignDetails: any; // Core campaign details
}