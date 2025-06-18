import { 
  CreateCustomAudienceRequestDto, 
  CreateLookalikeAudienceRequestDto, 
  AudienceResponseDto, 
  AudienceListResponseDto, 
  UpdateAudienceRequestDto, 
  SyncAudienceRequestDto, 
  AudienceSyncStatusResponseDto,
  AudienceQueryDto
} from '../api/v1/dtos'; // Adjust path as necessary. Assuming DTOs are in an index.ts or directly accessible.

export interface IAudienceManagementService {
  createCustomAudience(
    merchantId: string, 
    createDto: CreateCustomAudienceRequestDto
  ): Promise<AudienceResponseDto>;

  createLookalikeAudience(
    merchantId: string, 
    createDto: CreateLookalikeAudienceRequestDto
  ): Promise<AudienceResponseDto>;

  getAudienceById(
    merchantId: string, 
    audienceId: string
  ): Promise<AudienceResponseDto | null>;

  listAudiences(
    merchantId: string, 
    query: AudienceQueryDto
  ): Promise<AudienceListResponseDto>;

  updateAudience(
    merchantId: string, 
    audienceId: string, 
    updateDto: UpdateAudienceRequestDto
  ): Promise<AudienceResponseDto>;

  deleteAudience(
    merchantId: string, 
    audienceId: string
  ): Promise<void>;

  synchronizeAudience(
    merchantId: string, 
    audienceId: string, 
    syncRequest: SyncAudienceRequestDto
  ): Promise<AudienceSyncStatusResponseDto[]>; // Returns status for networks requested in syncRequest

  getAudienceSynchronizationStatus(
    merchantId: string, 
    audienceId: string, 
    adNetworkId?: string // Optional: to get status for a specific network
  ): Promise<AudienceSyncStatusResponseDto[]>; // Returns status for all configured networks or the specified one
}