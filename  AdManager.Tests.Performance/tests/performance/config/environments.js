// Example structure - configure URLs for different environments
const environments = {
    dev: {
        API_BASE_URL: __ENV.DEV_API_BASE_URL || 'https://dev-api.admanager.example.com/v1',
        AUTH_URL: __ENV.DEV_AUTH_URL || 'https://dev-auth.admanager.example.com/token',
        LANDING_PAGE_BASE_URL: __ENV.DEV_LANDING_PAGE_BASE_URL || 'https://dev-lp.admanager.example.com',
        IMPRESSION_INGESTION_URL: __ENV.DEV_IMPRESSION_INGESTION_URL || 'https://dev-analytics.admanager.example.com/impressions',
        // ... other dev-specific params
    },
    staging: {
        API_BASE_URL: __ENV.STAGING_API_BASE_URL || 'https://staging-api.admanager.example.com/v1',
        AUTH_URL: __ENV.STAGING_AUTH_URL || 'https://staging-auth.admanager.example.com/token',
        LANDING_PAGE_BASE_URL: __ENV.STAGING_LANDING_PAGE_BASE_URL || 'https://staging-lp.admanager.example.com',
        IMPRESSION_INGESTION_URL: __ENV.STAGING_IMPRESSION_INGESTION_URL || 'https://staging-analytics.admanager.example.com/impressions',
        // ... other staging-specific params
    },
    perf: {
        API_BASE_URL: __ENV.PERF_API_BASE_URL || 'https://perf-api.admanager.example.com/v1',
        AUTH_URL: __ENV.PERF_AUTH_URL || 'https://perf-auth.admanager.example.com/token',
        LANDING_PAGE_BASE_URL: __ENV.PERF_LANDING_PAGE_BASE_URL || 'https://perf-lp.admanager.example.com',
        IMPRESSION_INGESTION_URL: __ENV.PERF_IMPRESSION_INGESTION_URL || 'https://perf-analytics.admanager.example.com/impressions',
        // ... other perf-specific params
    },
};

export const ENV_CONFIG = (() => {
    const env = __ENV.K6_ENV || 'dev'; // K6_ENV is a k6 environment variable
    if (!environments[env]) {
        throw new Error(`Configuration for environment "${env}" not found.`);
    }
    console.log(`Using environment: ${env}`);
    return environments[env];
})();

/**
 * Returns the current environment configuration.
 * @returns {object} The configuration object for the current environment.
 */
export function getCurrentEnvironmentConfig() {
    return ENV_CONFIG;
}