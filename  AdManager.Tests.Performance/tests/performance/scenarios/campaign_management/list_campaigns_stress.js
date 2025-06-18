import { sleep } from 'k6';
import { getAuthToken } from '../../lib/auth.js';
import { get, checkResponse } from '../../lib/http.js';
import { stressTestProfile } from '../../config/scenario_profiles.js';
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';
// Assuming viewCampaignListTime metric is defined in lib/metrics.js if needed for specific tracking
// import { viewCampaignListTime } from '../../lib/metrics.js';

// Merge default thresholds with scenario-specific thresholds
const scenarioThresholds = {
    ...defaultThresholds,
    'http_req_failed': ['rate<0.05'], // Allow up to 5% errors under stress
    // Optionally:
    // 'http_req_duration{scenario:list_campaigns_stress}': ['p(95)<2000'], // Higher response times allowed
};

// k6 options configuration
export let options = {
    ...stressTestProfile, // Use the predefined stress test profile
    thresholds: scenarioThresholds,
    tags: { scenario: 'list_campaigns_stress' },
};

// Setup function: runs once per test run
export function setup() {
    console.log(`Running setup for list_campaigns_stress against ${ENV_CONFIG.API_BASE_URL}`);
    // Get authentication token
    const authToken = getAuthToken(__ENV.K6_USER_1, __ENV.K6_PASSWORD_1);
    console.log("Setup complete: Auth token obtained.");
    return { authToken: authToken };
}

// Default function: runs for each VU iteration
export default function (data) {
    const authToken = data.authToken;

    // Make a GET request to list campaigns with pagination parameters
    const listCampaignsPath = '/campaigns?page=1&limit=20';

    const res = get(listCampaignsPath, authToken);

    // Check if the response status is 200 (OK)
    checkResponse(res, 200);

    // Optionally, record response time if a custom Trend metric is defined for this operation
    // For example, if viewCampaignListTime is a Trend:
    // viewCampaignListTime.add(res.timings.duration);

    // Add a short sleep period
    sleep(0.5); // Sleep for 0.5 seconds
}