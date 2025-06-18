import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum SagaState {
  STARTED = 'STARTED',
  PENDING_BILLING_CHECK = 'PENDING_BILLING_CHECK',
  PENDING_PRODUCT_FEED_PREP = 'PENDING_PRODUCT_FEED_PREP',
  PENDING_AD_NETWORK_PUBLISH = 'PENDING_AD_NETWORK_PUBLISH',
  PENDING_CAMPAIGN_STATUS_UPDATE = 'PENDING_CAMPAIGN_STATUS_UPDATE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
  FAILED_FINALIZATION = 'FAILED_FINALIZATION',
}

export interface AdNetworkPublicationDetail {
  status: 'PENDING' | 'SUCCESS' | 'FAILURE';
  externalCampaignId?: string;
  failureReason?: string;
  timestamp: Date;
}

@Entity('campaign_publishing_saga_instances')
export class CampaignPublishingSagaInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  campaignId: string;

  @Column({ type: 'uuid' })
  @Index()
  merchantId: string;

  @Column({ type: 'enum', enum: SagaState, default: SagaState.STARTED })
  currentState: SagaState;

  @Column({ type: 'jsonb' })
  payload: any; // e.g., { initialRequest: CampaignCreationRequestedEvent, compliantAdNetworks: string[], ... }

  @Column({ type: 'uuid', unique: true })
  @Index()
  correlationId: string;

  @Column({ type: 'boolean', default: false })
  isCompensating: boolean;

  @Column({ type: 'jsonb', nullable: true })
  adNetworkPublishStatus?: Record<string, AdNetworkPublicationDetail>;

  @Column({ type: 'text', nullable: true })
  lastFailureReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}