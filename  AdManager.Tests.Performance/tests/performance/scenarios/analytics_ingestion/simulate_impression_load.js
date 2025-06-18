import { check } from 'k6';
import http from 'k6/http'; // Using k6 http directly
import { uuidv4, generateRandomString } from '../../lib/utils.js';
import { impressionApiErrorRate, analyticsProcessingTime } from '../../lib/metrics.js';
import { rpsTargetProfile } from '../../config/scenario_profiles.js';
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';

// Define the target RPS (impressions per second)
const TARGET_IMPRESSIONS_PER_SEC = parseInt(__ENV.TARGET_RPS || '1000'); // Default to 1000 if not set by env var
const TEST_DURATION = __ENV.TEST_DURATION || '5m';

// Merge default thresholds with scenario-specific thresholds
const scenarioThresholds = {
    ...defaultThresholds, // Includes http_req_failed, http_req_duration globally
    'impression_api_error_rate': ['rate<0.001'], // Very low error rate for ingestion (<0.1%)
    // 'analytics_processing_time' would be measured if a response provides this, or via backend monitoring
};

// k6 options configuration for constant arrival rate (RPS)
export let options = {
    ...rpsTargetProfile(TARGET_IMPRESSIONS_PER_SEC, TEST_DURATION),
    thresholds: scenarioThresholds,
    tags: { scenario: 'impression_load' },
};

// No setup() function needed if authentication is via API key or endpoint is public
// as specified in SDS 4.5.4 setup() being optional.

// Default function: runs for each arrival rate iteration
export default function () {
    const impressionIngestionUrl = ENV_CONFIG.IMPRESSION_INGESTION_URL;
    if (!impressionIngestionUrl) {
        console.error("IMPRESSION_INGESTION_URL is not configured in environments.js");
        return; // or fail test
    }
    if (!__ENV.IMPRESSION_API_KEY) {
        console.warn("IMPRESSION_API_KEY environment variable is not set. Request might fail.");
    }

    // Generate a sample impression payload
    const payload = {
        timestamp: new Date().toISOString(),
        campaignId: `camp-${uuidv4()}`,
        adId: `ad-${uuidv4()}`,
        userId: `user-${generateRandomString(10)}`,
        eventType: 'impression',
        pageUrl: `https://example.com/page/${generateRandomString(5)}`,
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: `K6TestAgent/1.0 (${generateRandomString(10)})`,
    };

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': __ENV.IMPRESSION_API_KEY || '', // Use API key from environment variable
        },
    };

    const res = http.post(impressionIngestionUrl, JSON.stringify(payload), params);

    const success = check(res, {
        'status is 202 or 200': (r) => r.status === 202 || r.status === 200,
    });

    impressionApiErrorRate.add(!success);

    // If the response contains information about processing time (hypothetical)
    // try {
    //   if (res.json('processingTimeMs')) {
    //     analyticsProcessingTime.add(res.json('processingTimeMs'));
    //   }
    // } catch (e) { /* ignore if not present */ }

    // No explicit sleep() here as 'constant-arrival-rate' executor manages the rate.
}