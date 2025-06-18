import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignPublishingSagaInstance, SagaState, AdNetworkPublicationDetail } from '../entities/campaign-publishing-saga-instance.entity';

@Injectable()
export class CampaignPublishingSagaInstanceRepository {
  private readonly logger = new Logger(CampaignPublishingSagaInstanceRepository.name);

  constructor(
    @InjectRepository(CampaignPublishingSagaInstance)
    private readonly repository: Repository<CampaignPublishingSagaInstance>,
  ) {}

  async createInstance(data: {
    campaignId: string;
    merchantId: string;
    correlationId: string;
    initialPayload: any;
  }): Promise<CampaignPublishingSagaInstance> {
    const instance = this.repository.create({
      campaignId: data.campaignId,
      merchantId: data.merchantId,
      correlationId: data.correlationId,
      currentState: SagaState.STARTED,
      payload: { initialRequest: data.initialPayload },
      adNetworkPublishStatus: {}, // Initialize as empty object
    });
    this.logger.log(`Creating new saga instance for correlationId: ${data.correlationId}`);
    return this.repository.save(instance);
  }

  async findById(id: string): Promise<CampaignPublishingSagaInstance | null> {
    this.logger.log(`Finding saga instance by id: ${id}`);
    const instance = await this.repository.findOneBy({ id });
    if (!instance) {
        this.logger.warn(`Saga instance with id ${id} not found.`);
    }
    return instance;
  }

  async findByCorrelationId(correlationId: string): Promise<CampaignPublishingSagaInstance | null> {
    this.logger.log(`Finding saga instance by correlationId: ${correlationId}`);
    const instance = await this.repository.findOneBy({ correlationId });
    if (!instance) {
        this.logger.warn(`Saga instance with correlationId ${correlationId} not found.`);
    }
    return instance;
  }

  async updateState(
    id: string,
    newState: SagaState,
    updatedPayload?: any,
    failureReason?: string,
  ): Promise<CampaignPublishingSagaInstance> {
    const instance = await this.findById(id);
    if (!instance) {
      this.logger.error(`Saga instance with id ${id} not found for state update.`);
      throw new NotFoundException(`Saga instance with id ${id} not found.`);
    }
    this.logger.log(`Updating state for saga instance ${id} to ${newState}. CorrelationId: ${instance.correlationId}`);
    instance.currentState = newState;
    if (updatedPayload) {
      instance.payload = { ...instance.payload, ...updatedPayload };
    }
    if (failureReason) {
      instance.lastFailureReason = failureReason;
    }
    return this.repository.save(instance);
  }

  async updateAdNetworkStatus(
    id: string,
    adNetworkId: string,
    statusDetail: AdNetworkPublicationDetail,
  ): Promise<CampaignPublishingSagaInstance> {
    const instance = await this.findById(id);
    if (!instance) {
      this.logger.error(`Saga instance with id ${id} not found for ad network status update.`);
      throw new NotFoundException(`Saga instance with id ${id} not found.`);
    }
    this.logger.log(`Updating ad network status for saga instance ${id}, adNetworkId: ${adNetworkId}. CorrelationId: ${instance.correlationId}`);
    if (!instance.adNetworkPublishStatus) {
      instance.adNetworkPublishStatus = {};
    }
    instance.adNetworkPublishStatus[adNetworkId] = statusDetail;
    return this.repository.save(instance);
  }

  async setCompensating(id: string, compensating: boolean): Promise<CampaignPublishingSagaInstance> {
    const instance = await this.findById(id);
    if (!instance) {
      this.logger.error(`Saga instance with id ${id} not found for setting compensating flag.`);
      throw new NotFoundException(`Saga instance with id ${id} not found.`);
    }
    this.logger.log(`Setting compensating flag for saga instance ${id} to ${compensating}. CorrelationId: ${instance.correlationId}`);
    instance.isCompensating = compensating;
    return this.repository.save(instance);
  }
}