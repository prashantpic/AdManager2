```typescript
export interface GoogleAdsApiConfig {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  loginCustomerId?: string; // MCC account ID if applicable
  refreshToken?: string; // Potentially OAuth refresh token if long-lived access is needed
}

export interface InstagramAdsApiConfig { // Corresponds to Facebook Marketing API
  appId: string;
  appSecret: string;
  accessToken: string; // User-specific or system user access token (might be per-merchant)
  businessManagerId?: string;
}

export interface TikTokAdsApiConfig {
  appId: string;
  secret: string;
  accessToken: string; // Advertiser access token (might be per-merchant)
  advertiserId?: string;
}

export interface SnapchatAdsApiConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string; // (might be per-merchant)
  organizationId: string;
}

export interface AdNetworkConfig {
  google: GoogleAdsApiConfig;
  instagram: InstagramAdsApiConfig;
  tiktok: TikTokAdsApiConfig;
  snapchat: SnapchatAdsApiConfig;
  
  // Global settings like default timeouts, retry attempts for resilience patterns
  defaultRequestTimeoutMs?: number;
  defaultRetryAttempts?: number;
  // Could also include default circuit breaker settings here
  // defaultCircuitBreakerTimeout?: number;
  // defaultCircuitBreakerErrorThresholdPercentage?: number;
  // defaultCircuitBreakerResetTimeout?: number;
}
```