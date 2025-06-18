import { registerAs } from '@nestjs/config';

export enum BillingConfigKeys {
  DEFAULT_GRACE_PERIOD_DAYS = 'DEFAULT_GRACE_PERIOD_DAYS',
  PLAN_CONFIG_SOURCE = 'PLAN_CONFIG_SOURCE', // e.g., 'DB', 'STATIC_JSON'
  // Add other billing-specific config keys as needed
}

export interface BillingConfig {
  defaultGracePeriodDays: number;
  planConfigSource: string;
  // Define structure for plan details if static, or other settings
  // Example:
  // staticPlans?: any[]; // Define a proper interface if using static plans
  // defaultTransactionFeeRate?: number;
  // defaultCommissionRate?: number;
}

export default registerAs(
  'billing',
  (): BillingConfig => ({
    defaultGracePeriodDays: parseInt(
      process.env.DEFAULT_GRACE_PERIOD_DAYS_CONFIG_KEY,
      10,
    ) || 7,
    planConfigSource: process.env.PLAN_CONFIG_SOURCE || 'DB',
    // Initialize other config values from process.env or defaults
  }),
);