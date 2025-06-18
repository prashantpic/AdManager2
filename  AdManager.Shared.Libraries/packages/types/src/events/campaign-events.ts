import { IBaseEventPayload, BaseEvent } from './event.schema.base';
import { CampaignDto } from '../dtos/campaign.dto';
import { CampaignStatus } from '../enums/campaign-status.enum';

// --- Campaign Created Event ---
export const CAMPAIGN_CREATED_EVENT_TYPE = 'AdManager.Campaign.Created';

export interface CampaignCreatedEventPayload extends IBaseEventPayload {
  campaign: CampaignDto;
}

export class CampaignCreatedEvent extends BaseEvent<CampaignCreatedEventPayload> {
  public readonly eventType = CAMPAIGN_CREATED_EVENT_TYPE;

  constructor(
    sourceService: string,
    payload: CampaignCreatedEventPayload,
    options?: ConstructorParameters<typeof BaseEvent>[2]
  ) {
    super(sourceService, payload, options);
  }
}


// --- Campaign Status Updated Event ---
export const CAMPAIGN_STATUS_UPDATED_EVENT_TYPE = 'AdManager.Campaign.StatusUpdated';

export interface CampaignStatusUpdatedEventPayload extends IBaseEventPayload {
  campaignId: string;
  merchantId: string;
  oldStatus: CampaignStatus;
  newStatus: CampaignStatus;
  updatedBy?: string; // userId
}

export class CampaignStatusUpdatedEvent extends BaseEvent<CampaignStatusUpdatedEventPayload> {
  public readonly eventType = CAMPAIGN_STATUS_UPDATED_EVENT_TYPE;
    constructor(
    sourceService: string,
    payload: CampaignStatusUpdatedEventPayload,
    options?: ConstructorParameters<typeof BaseEvent>[2]
  ) {
    super(sourceService, payload, options);
  }
}