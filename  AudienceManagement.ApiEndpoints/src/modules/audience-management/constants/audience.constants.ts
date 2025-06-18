export const AUDIENCE_MANAGEMENT_SERVICE_TOKEN = 'IAudienceManagementService';
export const AD_NETWORK_INTEGRATION_SERVICE_TOKEN = 'IAdNetworkService';
export const CORE_PLATFORM_DATA_SERVICE_TOKEN = 'ICorePlatformDataService';

export enum AudienceType {
  CUSTOM = 'CUSTOM',
  LOOKALIKE = 'LOOKALIKE',
}

export enum CustomAudienceSourceType {
  PLATFORM_DATA_SEGMENT = 'PLATFORM_DATA_SEGMENT',
  CUSTOMER_LIST_UPLOAD = 'CUSTOMER_LIST_UPLOAD',
}

export enum LookalikeAudienceSourceType {
  LOOKALIKE_SOURCE = 'LOOKALIKE_SOURCE', // Indicates it's derived from another audience
}

// Example Sync Statuses (can be expanded)
export enum AudienceSyncStatus {
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  PENDING_CREATION = 'PENDING_CREATION',
  PENDING_SYNC = 'PENDING_SYNC',
  SYNCING = 'SYNCING',
  SYNCED = 'SYNCED',
  FAILED_CREATION = 'FAILED_CREATION',
  FAILED_SYNC = 'FAILED_SYNC',
  DELETING = 'DELETING',
  DELETED_FROM_NETWORK = 'DELETED_FROM_NETWORK',
  FAILED_DELETION = 'FAILED_DELETION',
}