```typescript
import { registerAs } from '@nestjs/config';
import { AdNetworkConfig } from './ad-network.config.interface';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

// It's good practice to define validation classes if complex validation is needed.
// For simplicity, direct environment variable checks are shown here.
// In a real app, use class-validator on a class that represents these env vars.

export default registerAs(
  'adNetworkConfig',
  (): AdNetworkConfig => {
    const config: AdNetworkConfig = {
      google: {
        developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
        clientId: process.env.GOOGLE_ADS_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
        refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      },
      instagram: { // Facebook Marketing API
        appId: process.env.INSTAGRAM_ADS_APP_ID || '',
        appSecret: process.env.INSTAGRAM_ADS_APP_SECRET || '',
        accessToken: process.env.INSTAGRAM_ADS_ACCESS_TOKEN || '', // This might be merchant-specific and stored elsewhere
        businessManagerId: process.env.INSTAGRAM_ADS_BUSINESS_MANAGER_ID,
      },
      tiktok: {
        appId: process.env.TIKTOK_ADS_APP_ID || '',
        secret: process.env.TIKTOK_ADS_SECRET || '',
        accessToken: process.env.TIKTOK_ADS_ACCESS_TOKEN || '', // This might be merchant-specific
        advertiserId: process.env.TIKTOK_ADS_ADVERTISER_ID,
      },
      snapchat: {
        clientId: process.env.SNAPCHAT_ADS_CLIENT_ID || '',
        clientSecret: process.env.SNAPCHAT_ADS_CLIENT_SECRET || '',
        refreshToken: process.env.SNAPCHAT_ADS_REFRESH_TOKEN || '',
        organizationId: process.env.SNAPCHAT_ADS_ORGANIZATION_ID || '',
      },
      defaultRequestTimeoutMs: parseInt(process.env.DEFAULT_REQUEST_TIMEOUT_MS || '10000', 10),
      defaultRetryAttempts: parseInt(process.env.DEFAULT_RETRY_ATTEMPTS || '3', 10),
    };

    // Basic validation example (can be enhanced with class-validator on a dedicated config class)
    // This is a placeholder for a more robust validation strategy.
    // For instance, you could create a class AdNetworkConfigImpl with @ValidateNested decorators
    // and use class-validator to validate the whole object.
    const configToValidate = plainToClass(Object, config); // Simplified for this example
    const errors = validateSync(configToValidate, { skipMissingProperties: false });

    if (errors.length > 0) {
      // In a real application, you might want to throw a more specific error
      // or log these errors more verbosely.
      console.error('Configuration validation error:', errors.toString());
      throw new Error(`Configuration validation failed: ${errors.toString()}`);
    }
    
    // Example check for critical missing variables (illustrative)
    if (!config.google.developerToken && process.env.NODE_ENV !== 'test') {
         // console.warn('Warning: GOOGLE_ADS_DEVELOPER_TOKEN is not set.');
         // Depending on requirements, this could be an error:
         // throw new Error('Missing GOOGLE_ADS_DEVELOPER_TOKEN configuration');
    }


    return config;
  },
);
```