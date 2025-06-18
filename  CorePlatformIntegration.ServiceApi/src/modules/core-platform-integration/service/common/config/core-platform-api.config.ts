import { registerAs } from '@nestjs/config';

export interface CorePlatformApiConfigInterface {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  productApiEndpoint: string;
  authApiEndpoint: string;
  customerApiEndpoint: string;
  orderApiEndpoint: string;
  apiKey?: string; // Optional API key
}

export const CorePlatformApiConfig = registerAs(
  'corePlatformApi',
  (): CorePlatformApiConfigInterface => ({
    baseUrl:
      process.env.CORE_PLATFORM_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.CORE_PLATFORM_API_TIMEOUT_MS, 10) || 5000,
    retryAttempts:
      parseInt(process.env.CORE_PLATFORM_API_RETRY_ATTEMPTS, 10) || 3,
    productApiEndpoint:
      process.env.CORE_PLATFORM_PRODUCT_API_ENDPOINT || '/products',
    authApiEndpoint:
      process.env.CORE_PLATFORM_AUTH_API_ENDPOINT || '/auth/verify',
    customerApiEndpoint:
      process.env.CORE_PLATFORM_CUSTOMER_API_ENDPOINT || '/customers',
    orderApiEndpoint:
      process.env.CORE_PLATFORM_ORDER_API_ENDPOINT || '/orders',
    apiKey: process.env.CORE_PLATFORM_API_KEY, // Load from env, should be managed via Secrets Manager in production
  }),
);