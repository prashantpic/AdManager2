import { Injectable, Inject, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  CreateCustomAudienceRequestDto, 
  CreateLookalikeAudienceRequestDto, 
  AudienceResponseDto, 
  AudienceListResponseDto, 
  UpdateAudienceRequestDto, 
  SyncAudienceRequestDto, 
  AudienceSyncStatusResponseDto,
  AudienceQueryDto
} from '../api/v1/dtos';
import { IAudienceManagementService } from './audience-management.service.interface';
import { 
  AD_NETWORK_INTEGRATION_SERVICE_TOKEN, 
  AUDIENCE_MANAGEMENT_SERVICE_TOKEN, 
  CORE_PLATFORM_DATA_SERVICE_TOKEN,
  AudienceType,
  CustomAudienceSourceType,
  LookalikeAudienceSourceType,
  AudienceSyncStatus
} from '../constants/audience.constants';
import { IAdNetworkService } from '../interfaces/ad-network.interface';
import { ICorePlatformDataService } from '../interfaces/platform-data.interface';
import { Audience, AdNetworkSyncDetail } from '../entities/audience.entity'; // Conceptual entity
import { v4 as uuidv4 } from 'uuid'; // For generating mock IDs

@Injectable()
export class AudienceManagementService implements IAudienceManagementService {
  private readonly logger: Logger;

  constructor(
    @Inject(AD_NETWORK_INTEGRATION_SERVICE_TOKEN)
    private readonly adNetworkIntegrationService: IAdNetworkService,
    @Inject(CORE_PLATFORM_DATA_SERVICE_TOKEN)
    private readonly corePlatformDataService: ICorePlatformDataService,
    // Using the service token for the logger name for clarity if AudienceManagementService is a provider itself.
    // Or just pass 'AudienceManagementService' string.
    // For this exercise, assuming Logger is provided by core module and can be injected directly.
    // If not, it should be instantiated: private readonly logger = new Logger(AudienceManagementService.name);
    // As per SDS 13.2, Logger is a provider in AudienceManagementCoreModule.
    logger: Logger
  ) {
    this.logger = logger;
    this.logger.setContext(AudienceManagementService.name);
  }

  // Mock in-memory store for audiences for demonstration purposes
  private mockAudiences: Audience[] = [];

  async createCustomAudience(
    merchantId: string,
    createDto: CreateCustomAudienceRequestDto,
  ): Promise<AudienceResponseDto> {
    this.logger.log(`[${merchantId}] Creating custom audience: ${createDto.name}`);

    // Simulate PII handling for customer list upload
    if (createDto.sourceType === CustomAudienceSourceType.CUSTOMER_LIST_UPLOAD) {
      if (!createDto.customerListFileKey) {
        throw new BadRequestException('customerListFileKey is required for CUSTOMER_LIST_UPLOAD sourceType.');
      }
      // In a real scenario, we'd fetch data using customerListFileKey
      // and then hash PII fields if specified.
      // For mock purposes, assume this step is successful.
      if (createDto.dataProcessingOptions.piiHashingFields && createDto.dataProcessingOptions.piiHashingFields.length > 0) {
        this.logger.log(`[${merchantId}] Hashing PII fields: ${createDto.dataProcessingOptions.piiHashingFields.join(', ')} for file ${createDto.customerListFileKey}`);
        // conceptual call:
        // await this.corePlatformDataService.hashCustomerPiiBatch([], createDto.dataProcessingOptions.piiHashingFields as any);
      }
    } else if (createDto.sourceType === CustomAudienceSourceType.PLATFORM_DATA_SEGMENT) {
        if (!createDto.platformDataSourceId) {
            throw new BadRequestException('platformDataSourceId is required for PLATFORM_DATA_SEGMENT sourceType.');
        }
        this.logger.log(`[${merchantId}] Using platform data segment: ${createDto.platformDataSourceId}`);
        // conceptual call:
        // await this.corePlatformDataService.getCustomerPiiBySegment(createDto.platformDataSourceId, merchantId);
    }


    const audienceId = uuidv4();
    const now = new Date();
    
    const adNetworkSyncDetails: AdNetworkSyncDetail[] = [];

    for (const adNetworkId of createDto.targetAdNetworkIds) {
      try {
        const networkDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(adNetworkId);
        if (!networkDetails.supportsCustomAudiences) {
            this.logger.warn(`[${merchantId}] Ad network ${adNetworkId} (${networkDetails.name}) does not support custom audiences. Skipping.`);
            adNetworkSyncDetails.push({
                adNetworkId: adNetworkId,
                adNetworkName: networkDetails.name,
                status: AudienceSyncStatus.NOT_CONFIGURED,
                message: 'Ad network does not support custom audiences of this type.',
            });
            continue;
        }
        
        const audienceDefinition = {
            name: createDto.name,
            description: createDto.description,
            // In real scenario, this would include hashed data or segment rules
            sourceDataReference: createDto.sourceType === CustomAudienceSourceType.CUSTOMER_LIST_UPLOAD 
                ? createDto.customerListFileKey 
                : createDto.platformDataSourceId,
        };

        const result = await this.adNetworkIntegrationService.createCustomAudienceOnNetwork(
            adNetworkId,
            audienceDefinition,
            merchantId,
            audienceId
        );
        adNetworkSyncDetails.push({
            adNetworkId: adNetworkId,
            adNetworkName: networkDetails.name,
            externalAudienceId: result.externalAudienceId,
            status: result.status || AudienceSyncStatus.PENDING_CREATION,
            lastSyncAttempt: new Date(),
            message: result.message,
        });
      } catch (error) {
        this.logger.error(`[${merchantId}] Failed to create custom audience on network ${adNetworkId}: ${error.message}`);
        // Get network name if possible, otherwise use ID
        let adNetworkName = adNetworkId;
        try {
            const tempDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(adNetworkId);
            adNetworkName = tempDetails.name;
        } catch (nameError) { /* ignore */ }

        adNetworkSyncDetails.push({
            adNetworkId: adNetworkId,
            adNetworkName: adNetworkName,
            status: AudienceSyncStatus.FAILED_CREATION,
            lastSyncAttempt: new Date(),
            message: error.message,
        });
      }
    }

    const newAudience: Audience = {
      id: audienceId,
      merchantId,
      name: createDto.name,
      description: createDto.description,
      type: AudienceType.CUSTOM,
      sourceType: createDto.sourceType,
      sourceDetails: {
        platformDataSourceId: createDto.platformDataSourceId,
        customerListFileKey: createDto.customerListFileKey,
      },
      adNetworkSyncInfo: adNetworkSyncDetails,
      createdAt: now,
      updatedAt: now,
    };

    this.mockAudiences.push(newAudience);
    return this.mapToAudienceResponseDto(newAudience);
  }

  async createLookalikeAudience(
    merchantId: string,
    createDto: CreateLookalikeAudienceRequestDto,
  ): Promise<AudienceResponseDto> {
    this.logger.log(`[${merchantId}] Creating lookalike audience: ${createDto.name} from source ${createDto.sourceAudienceId}`);

    const sourceAudience = this.mockAudiences.find(
      aud => aud.id === createDto.sourceAudienceId && aud.merchantId === merchantId && aud.type === AudienceType.CUSTOM
    );

    if (!sourceAudience) {
      throw new NotFoundException(`Source custom audience with ID ${createDto.sourceAudienceId} not found or not a custom audience.`);
    }
    if (sourceAudience.adNetworkSyncInfo.length === 0) {
        throw new BadRequestException(`Source audience ${createDto.sourceAudienceId} has no ad network sync information. Cannot create lookalike.`);
    }


    const audienceId = uuidv4();
    const now = new Date();
    const adNetworkSyncDetails: AdNetworkSyncDetail[] = [];

    for (const spec of createDto.lookalikeSpecifications) {
        const sourceNetworkInfo = sourceAudience.adNetworkSyncInfo.find(s => s.adNetworkId === spec.adNetworkId);
        if (!sourceNetworkInfo || !sourceNetworkInfo.externalAudienceId || sourceNetworkInfo.status !== AudienceSyncStatus.SYNCED) {
            this.logger.warn(`[${merchantId}] Source audience ${createDto.sourceAudienceId} is not properly synced with ad network ${spec.adNetworkId}. Skipping lookalike creation for this network.`);
             let adNetworkName = spec.adNetworkId;
            try {
                const tempDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(spec.adNetworkId);
                adNetworkName = tempDetails.name;
            } catch (nameError) { /* ignore */ }
            adNetworkSyncDetails.push({
                adNetworkId: spec.adNetworkId,
                adNetworkName: adNetworkName,
                status: AudienceSyncStatus.FAILED_CREATION,
                message: `Source audience not available or not synced on network ${spec.adNetworkId}.`,
            });
            continue;
        }

        try {
            const networkDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(spec.adNetworkId);
            if(!networkDetails.supportsLookalikeAudiences){
                this.logger.warn(`[${merchantId}] Ad network ${spec.adNetworkId} (${networkDetails.name}) does not support lookalike audiences. Skipping.`);
                adNetworkSyncDetails.push({
                    adNetworkId: spec.adNetworkId,
                    adNetworkName: networkDetails.name,
                    status: AudienceSyncStatus.NOT_CONFIGURED,
                    message: 'Ad network does not support lookalike audiences.',
                });
                continue;
            }

            const lookalikeSpecForNetwork = {
                countryCode: spec.countryCode,
                sizePercentage: spec.sizePercentage,
            };

            const result = await this.adNetworkIntegrationService.createLookalikeAudienceOnNetwork(
                spec.adNetworkId,
                sourceNetworkInfo.externalAudienceId,
                lookalikeSpecForNetwork,
                merchantId,
                audienceId
            );

            adNetworkSyncDetails.push({
                adNetworkId: spec.adNetworkId,
                adNetworkName: networkDetails.name,
                externalAudienceId: result.externalAudienceId,
                status: result.status || AudienceSyncStatus.PENDING_CREATION,
                lastSyncAttempt: new Date(),
                message: result.message,
            });

        } catch (error) {
            this.logger.error(`[${merchantId}] Failed to create lookalike audience on network ${spec.adNetworkId}: ${error.message}`);
            let adNetworkName = spec.adNetworkId;
            try {
                const tempDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(spec.adNetworkId);
                adNetworkName = tempDetails.name;
            } catch (nameError) { /* ignore */ }
            adNetworkSyncDetails.push({
                adNetworkId: spec.adNetworkId,
                adNetworkName: adNetworkName,
                status: AudienceSyncStatus.FAILED_CREATION,
                lastSyncAttempt: new Date(),
                message: error.message,
            });
        }
    }


    const newAudience: Audience = {
      id: audienceId,
      merchantId,
      name: createDto.name,
      description: createDto.description,
      type: AudienceType.LOOKALIKE,
      sourceType: LookalikeAudienceSourceType.LOOKALIKE_SOURCE,
      sourceDetails: {
        originalSourceAudienceId: createDto.sourceAudienceId,
      },
      adNetworkSyncInfo: adNetworkSyncDetails,
      createdAt: now,
      updatedAt: now,
    };
    this.mockAudiences.push(newAudience);
    return this.mapToAudienceResponseDto(newAudience);
  }

  async getAudienceById(
    merchantId: string,
    audienceId: string,
  ): Promise<AudienceResponseDto | null> {
    this.logger.log(`[${merchantId}] Getting audience by ID: ${audienceId}`);
    const audience = this.mockAudiences.find(
      aud => aud.id === audienceId && aud.merchantId === merchantId && !aud.deletedAt
    );
    if (!audience) {
      return null; // Controller will throw NotFoundException
    }
    return this.mapToAudienceResponseDto(audience);
  }

  async listAudiences(
    merchantId: string,
    query: AudienceQueryDto,
  ): Promise<AudienceListResponseDto> {
    this.logger.log(`[${merchantId}] Listing audiences with query: ${JSON.stringify(query)}`);
    
    let filteredAudiences = this.mockAudiences.filter(
        aud => aud.merchantId === merchantId && !aud.deletedAt
    );

    if (query.name) {
      filteredAudiences = filteredAudiences.filter(aud => aud.name.toLowerCase().includes(query.name.toLowerCase()));
    }
    if (query.type) {
      filteredAudiences = filteredAudiences.filter(aud => aud.type === query.type);
    }
    if (query.adNetworkId) {
      filteredAudiences = filteredAudiences.filter(aud => 
        aud.adNetworkSyncInfo.some(syncInfo => syncInfo.adNetworkId === query.adNetworkId)
      );
    }

    const total = filteredAudiences.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedAudiences = filteredAudiences.slice(startIndex, endIndex);

    return {
      data: paginatedAudiences.map(aud => this.mapToAudienceResponseDto(aud)),
      total,
      page,
      limit,
    };
  }

  async updateAudience(
    merchantId: string,
    audienceId: string,
    updateDto: UpdateAudienceRequestDto,
  ): Promise<AudienceResponseDto> {
    this.logger.log(`[${merchantId}] Updating audience ID: ${audienceId} with data: ${JSON.stringify(updateDto)}`);
    const audienceIndex = this.mockAudiences.findIndex(
      aud => aud.id === audienceId && aud.merchantId === merchantId && !aud.deletedAt
    );

    if (audienceIndex === -1) {
      throw new NotFoundException(`Audience with ID ${audienceId} not found.`);
    }

    const audience = this.mockAudiences[audienceIndex];
    if (updateDto.name !== undefined) {
      audience.name = updateDto.name;
    }
    if (updateDto.description !== undefined) { // Allows setting description to null
      audience.description = updateDto.description;
    }
    audience.updatedAt = new Date();
    
    // Potentially re-sync name/description to ad networks if supported
    // For this mock, we are not implementing that part.

    this.mockAudiences[audienceIndex] = audience;
    return this.mapToAudienceResponseDto(audience);
  }

  async deleteAudience(
    merchantId: string,
    audienceId: string,
  ): Promise<void> {
    this.logger.log(`[${merchantId}] Deleting audience ID: ${audienceId}`);
    const audienceIndex = this.mockAudiences.findIndex(
      aud => aud.id === audienceId && aud.merchantId === merchantId && !aud.deletedAt
    );

    if (audienceIndex === -1) {
      throw new NotFoundException(`Audience with ID ${audienceId} not found.`);
    }

    // Soft delete for mock
    this.mockAudiences[audienceIndex].deletedAt = new Date();
    this.mockAudiences[audienceIndex].updatedAt = new Date();

    // In a real scenario, trigger deletion/disassociation from ad networks
    // For example:
    // for (const syncInfo of this.mockAudiences[audienceIndex].adNetworkSyncInfo) {
    //   if (syncInfo.externalAudienceId) {
    //     await this.adNetworkIntegrationService.deleteAudienceFromNetwork(syncInfo.adNetworkId, syncInfo.externalAudienceId, merchantId);
    //     syncInfo.status = AudienceSyncStatus.DELETING; // or DELETED_FROM_NETWORK
    //   }
    // }
    this.logger.log(`[${merchantId}] Audience ID: ${audienceId} marked as deleted.`);
  }

  async synchronizeAudience(
    merchantId: string,
    audienceId: string,
    syncRequest: SyncAudienceRequestDto,
  ): Promise<AudienceSyncStatusResponseDto[]> {
    this.logger.log(`[${merchantId}] Synchronizing audience ID: ${audienceId} with networks: ${syncRequest.adNetworkIds.join(', ')}`);
    const audience = this.mockAudiences.find(
      aud => aud.id === audienceId && aud.merchantId === merchantId && !aud.deletedAt
    );

    if (!audience) {
      throw new NotFoundException(`Audience with ID ${audienceId} not found.`);
    }

    const updatedSyncStatuses: AudienceSyncStatusResponseDto[] = [];

    for (const adNetworkId of syncRequest.adNetworkIds) {
      let syncDetail = audience.adNetworkSyncInfo.find(s => s.adNetworkId === adNetworkId);
      const networkDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(adNetworkId);

      if (!syncDetail) { // New network for this audience
        syncDetail = {
            adNetworkId,
            adNetworkName: networkDetails.name,
            status: AudienceSyncStatus.PENDING_CREATION, // Or PENDING_SYNC if it's custom/lookalike creation logic
            lastSyncAttempt: new Date(),
        };
        audience.adNetworkSyncInfo.push(syncDetail);
      }
      
      syncDetail.lastSyncAttempt = new Date();

      try {
        if (audience.type === AudienceType.CUSTOM && !networkDetails.supportsCustomAudiences) {
             throw new BadRequestException(`Ad network ${adNetworkId} (${networkDetails.name}) does not support custom audiences.`);
        }
        if (audience.type === AudienceType.LOOKALIKE && !networkDetails.supportsLookalikeAudiences) {
            throw new BadRequestException(`Ad network ${adNetworkId} (${networkDetails.name}) does not support lookalike audiences.`);
        }

        // If it was PENDING_CREATION, it might need to go through createCustomAudienceOnNetwork or createLookalikeAudienceOnNetwork logic.
        // For simplicity in this mock, we assume it's a generic sync.
        if (syncDetail.externalAudienceId) {
            const result = await this.adNetworkIntegrationService.synchronizeAudienceWithNetwork(
                adNetworkId,
                syncDetail.externalAudienceId,
                { /* Audience data/rules to sync */ },
                merchantId,
            );
            syncDetail.status = result.status || AudienceSyncStatus.SYNCING;
            syncDetail.message = result.message;
            syncDetail.lastSuccessfulSync = result.status === AudienceSyncStatus.SYNCED ? new Date() : syncDetail.lastSuccessfulSync;
        } else {
            // This case implies the audience was not yet created on the network.
            // A more robust implementation would call the respective create method.
            // For this mock, we'll just set to PENDING_CREATION or PENDING_SYNC.
            if (audience.type === AudienceType.CUSTOM) {
                const audienceDefinition = {
                    name: audience.name,
                    description: audience.description,
                    sourceDataReference: audience.sourceDetails.customerListFileKey || audience.sourceDetails.platformDataSourceId,
                };
                const creationResult = await this.adNetworkIntegrationService.createCustomAudienceOnNetwork(adNetworkId, audienceDefinition, merchantId, audience.id);
                syncDetail.externalAudienceId = creationResult.externalAudienceId;
                syncDetail.status = creationResult.status || AudienceSyncStatus.PENDING_CREATION;
                syncDetail.message = creationResult.message;
            } else if (audience.type === AudienceType.LOOKALIKE) {
                // Find source audience's external ID on this network
                const sourceAudienceEntity = this.mockAudiences.find(a => a.id === audience.sourceDetails.originalSourceAudienceId);
                const sourceNetworkInfo = sourceAudienceEntity?.adNetworkSyncInfo.find(s => s.adNetworkId === adNetworkId);
                if (!sourceNetworkInfo?.externalAudienceId) {
                    throw new BadRequestException(`Source audience for lookalike not synced on network ${adNetworkId}.`);
                }
                // Mock lookalike spec retrieval or use a default
                const lookalikeSpec = { countryCode: 'US', sizePercentage: 1 }; // Example
                const creationResult = await this.adNetworkIntegrationService.createLookalikeAudienceOnNetwork(adNetworkId, sourceNetworkInfo.externalAudienceId, lookalikeSpec, merchantId, audience.id);
                syncDetail.externalAudienceId = creationResult.externalAudienceId;
                syncDetail.status = creationResult.status || AudienceSyncStatus.PENDING_CREATION;
                syncDetail.message = creationResult.message;
            }
        }
        
        updatedSyncStatuses.push({
            adNetworkId: syncDetail.adNetworkId,
            adNetworkName: syncDetail.adNetworkName,
            externalAudienceId: syncDetail.externalAudienceId,
            status: syncDetail.status,
            lastSyncedAt: syncDetail.lastSuccessfulSync || syncDetail.lastSyncAttempt,
            currentSize: syncDetail.currentSize,
            message: syncDetail.message,
        });

      } catch (error) {
        this.logger.error(`[${merchantId}] Failed to sync audience ${audienceId} with network ${adNetworkId}: ${error.message}`);
        syncDetail.status = AudienceSyncStatus.FAILED_SYNC;
        syncDetail.message = error.message;
        
        updatedSyncStatuses.push({
            adNetworkId: syncDetail.adNetworkId,
            adNetworkName: syncDetail.adNetworkName,
            externalAudienceId: syncDetail.externalAudienceId,
            status: syncDetail.status,
            lastSyncedAt: syncDetail.lastSuccessfulSync || syncDetail.lastSyncAttempt,
            currentSize: syncDetail.currentSize,
            message: syncDetail.message,
        });
      }
    }
    audience.updatedAt = new Date();
    return updatedSyncStatuses;
  }

  async getAudienceSynchronizationStatus(
    merchantId: string,
    audienceId: string,
    adNetworkId?: string,
  ): Promise<AudienceSyncStatusResponseDto[]> {
    this.logger.log(`[${merchantId}] Getting sync status for audience ID: ${audienceId}` + (adNetworkId ? ` for network: ${adNetworkId}` : ''));
    const audience = this.mockAudiences.find(
      aud => aud.id === audienceId && aud.merchantId === merchantId && !aud.deletedAt
    );

    if (!audience) {
      throw new NotFoundException(`Audience with ID ${audienceId} not found.`);
    }

    let relevantSyncInfo = audience.adNetworkSyncInfo;
    if (adNetworkId) {
      relevantSyncInfo = audience.adNetworkSyncInfo.filter(s => s.adNetworkId === adNetworkId);
      if (relevantSyncInfo.length === 0) {
        const networkDetails = await this.adNetworkIntegrationService.getAdNetworkDetails(adNetworkId);
        return [{
            adNetworkId: adNetworkId,
            adNetworkName: networkDetails.name,
            status: AudienceSyncStatus.NOT_CONFIGURED,
            message: 'Audience not configured for this ad network.'
        }];
      }
    }
    
    // Simulate fetching fresh status from network
    const results: AudienceSyncStatusResponseDto[] = [];
    for(const syncDetail of relevantSyncInfo) {
        if(syncDetail.externalAudienceId && syncDetail.status !== AudienceSyncStatus.FAILED_CREATION && syncDetail.status !== AudienceSyncStatus.NOT_CONFIGURED) {
            try {
                const networkStatus = await this.adNetworkIntegrationService.getAudienceSyncStatusFromNetwork(
                    syncDetail.adNetworkId,
                    syncDetail.externalAudienceId,
                    merchantId
                );
                syncDetail.status = networkStatus.status || syncDetail.status;
                syncDetail.currentSize = networkStatus.size !== undefined ? networkStatus.size : syncDetail.currentSize;
                syncDetail.message = networkStatus.message || syncDetail.message;
                if (networkStatus.status === AudienceSyncStatus.SYNCED) {
                    syncDetail.lastSuccessfulSync = networkStatus.lastRefreshed || new Date();
                }
                syncDetail.lastSyncAttempt = new Date(); // Or use lastRefreshed from networkStatus
            } catch (error) {
                this.logger.warn(`[${merchantId}] Could not refresh status for audience ${audienceId} on network ${syncDetail.adNetworkId}: ${error.message}`);
                // Keep existing status but update message if desired
                syncDetail.message = `Failed to refresh status: ${error.message}`;
            }
        }
        results.push({
            adNetworkId: syncDetail.adNetworkId,
            adNetworkName: syncDetail.adNetworkName,
            externalAudienceId: syncDetail.externalAudienceId,
            status: syncDetail.status,
            lastSyncedAt: syncDetail.lastSuccessfulSync || syncDetail.lastSyncAttempt,
            currentSize: syncDetail.currentSize,
            message: syncDetail.message,
        });
    }
    audience.updatedAt = new Date(); // if status updates modified the audience
    return results;
  }

  private mapToAudienceResponseDto(audience: Audience): AudienceResponseDto {
    return {
      id: audience.id,
      merchantId: audience.merchantId,
      name: audience.name,
      description: audience.description,
      type: audience.type,
      sourceType: audience.sourceType,
      sourceDetails: audience.sourceDetails,
      adNetworkSyncInfo: audience.adNetworkSyncInfo.map(syncInfo => ({
        adNetworkId: syncInfo.adNetworkId,
        adNetworkName: syncInfo.adNetworkName,
        externalAudienceId: syncInfo.externalAudienceId,
        status: syncInfo.status,
        lastSyncedAt: syncInfo.lastSuccessfulSync || syncInfo.lastSyncAttempt, // prefer lastSuccessfulSync
        currentSize: syncInfo.currentSize,
        message: syncInfo.message,
      })),
      createdAt: audience.createdAt,
      updatedAt: audience.updatedAt,
    };
  }
  
  // Example private method as described in file structure for AudienceManagementService.
  // Not directly used by the interface methods in this mock, but shows structure.
  private async handlePiiForAdNetwork(
    merchantId: string,
    audienceData: any[], // e.g., CustomerPii[]
    dataProcessingOptions: { piiHashingFields?: string[]; consentVerified: boolean; }
  ): Promise<any[]> {
    this.logger.log(`[${merchantId}] Handling PII for ad network.`);
    if (!dataProcessingOptions.consentVerified) {
      throw new BadRequestException('Consent for data processing must be verified.');
    }

    if (dataProcessingOptions.piiHashingFields && dataProcessingOptions.piiHashingFields.length > 0 && audienceData.length > 0) {
      this.logger.log(`[${merchantId}] Hashing fields: ${dataProcessingOptions.piiHashingFields.join(', ')}`);
      // return this.corePlatformDataService.hashCustomerPiiBatch(audienceData, dataProcessingOptions.piiHashingFields as any);
      // Mocked implementation:
      return audienceData.map(record => {
        const hashedRecord = { ...record };
        for (const field of dataProcessingOptions.piiHashingFields) {
          if (hashedRecord[field]) {
            hashedRecord[`${field}_hashed`] = `hashed_${hashedRecord[field]}`;
            // delete hashedRecord[field]; // Optionally remove original
          }
        }
        return hashedRecord;
      });
    }
    return audienceData;
  }
}