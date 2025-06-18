// AudienceDefinition can be complex and network-specific
export interface AudienceDefinition {
  name: string;
  description?: string;
  // ... other common fields, or allow 'any' for flexibility
  [key: string]: any;
}

export interface LookalikeSpec {
  countryCode: string;
  sizePercentage?: number;
  // ... other network-specific lookalike params
  [key: string]: any;
}

export interface IAdNetworkService {
  createCustomAudienceOnNetwork(
    adNetworkId: string, // e.g., 'google', 'facebook'
    audienceDefinition: AudienceDefinition, // Contains data like hashed PII list or rules
    merchantId: string, // For context, ad network account mapping
    adManagerAudienceId: string, // Ad Manager's internal ID for this audience
  ): Promise<{ externalAudienceId: string; status: string; message?: string }>;

  createLookalikeAudienceOnNetwork(
    adNetworkId: string,
    sourceExternalAudienceId: string, // The ID of the source audience on the ad network
    lookalikeSpec: LookalikeSpec,
    merchantId: string,
    adManagerAudienceId: string, // Ad Manager's internal ID for this new lookalike audience
  ): Promise<{ externalAudienceId: string; status: string; message?: string }>;

  // This might be more complex, potentially involving uploading data
  synchronizeAudienceWithNetwork(
    adNetworkId: string,
    externalAudienceId: string, // The ID of the audience on the ad network
    audienceData: any, // e.g., updated list of users to add/remove
    merchantId: string,
  ): Promise<{ status: string; message?: string }>;

  getAudienceSyncStatusFromNetwork(
    adNetworkId: string,
    externalAudienceId: string,
    merchantId: string,
  ): Promise<{ status: string; size?: number; message?: string; lastRefreshed?: Date }>;

  getAdNetworkDetails(
    adNetworkId: string,
  ): Promise<{
    id: string;
    name: string;
    supportsCustomAudiences: boolean;
    supportsLookalikeAudiences: boolean;
  }>;
}