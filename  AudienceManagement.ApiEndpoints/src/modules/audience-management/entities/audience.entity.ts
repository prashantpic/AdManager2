interface AdNetworkSyncDetail {
  adNetworkId: string;
  adNetworkName: string; // For display purposes
  externalAudienceId?: string; // ID on the ad network
  status: string; // e.g., 'SYNCED', 'PENDING_CREATION', 'PENDING_SYNC', 'FAILED_CREATION', 'FAILED_SYNC', 'NOT_CONFIGURED'
  lastSyncAttempt?: Date;
  lastSuccessfulSync?: Date;
  message?: string; // Error or informational message
  currentSize?: number; // Size on the ad network
}

export class Audience {
  id: string; // UUID, primary key
  merchantId: string; // UUID, links to merchant
  name: string;
  description?: string | null;
  type: 'CUSTOM' | 'LOOKALIKE';
  sourceType: 'PLATFORM_DATA_SEGMENT' | 'CUSTOMER_LIST_UPLOAD' | 'LOOKALIKE_SOURCE'; // For CUSTOM, or identifies the source type for LOOKALIKE
  
  // Details specific to the source
  sourceDetails: {
    platformDataSourceId?: string;       // If sourceType is PLATFORM_DATA_SEGMENT
    customerListFileKey?: string;      // If sourceType is CUSTOMER_LIST_UPLOAD
    originalSourceAudienceId?: string; // If type is LOOKALIKE, this is the AdManager ID of the source custom audience
    // For LOOKALIKE, might also store the specific spec used per network if it varies beyond general creation params
  };

  // Stores synchronization information for each ad network this audience is targeted for
  adNetworkSyncInfo: AdNetworkSyncDetail[];
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // For soft deletes
}