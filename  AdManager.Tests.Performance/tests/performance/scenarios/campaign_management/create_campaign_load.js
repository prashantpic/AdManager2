import { sleep } from 'k6';
import { getAuthToken } from '../../lib/auth.js';
import { post, checkResponse } from '../../lib/http.js';
import { campaignCreationTime } from '../../lib/metrics.js';
import { generateRandomString } from '../../lib/utils.js';
import { loadTestProfile } from '../../config/scenario_profiles.js';
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';

// Merge default thresholds with scenario-specific thresholds
const scenarioThresholds = {
    ...defaultThresholds,
    'campaign_creation_time': ['p(95)<1000'], // 95% of creations faster than 1000ms (1 second)
};

// k6 options configuration
export let options = {
    ...loadTestProfile, // Use the predefined load test profile
    thresholds: scenarioThresholds,
    tags: { scenario: 'create_campaign_load' },
};

// Setup function: runs once per test run
export function setup() {
    console.log(`Running setup for create_campaign_load against ${ENV_CONFIG.API_BASE_URL}`);
    // Get authentication token using test user credentials from environment variables
    const authToken = getAuthToken(__ENV.K6_USER_1, __ENV.K6_PASSWORD_1);
    console.log("Setup complete: Auth token obtained.");
    return { authToken: authToken };
}

// Default function: runs for each VU iteration
export default function (data) {
    const authToken = data.authToken;

    // Generate a unique campaign payload for each iteration
    const campaignName = `PerfTestCampaign-${generateRandomString(8)}-${__VU}-${__ITER}`;
    const payload = {
        name: campaignName,
        budgetTarget: Math.floor(Math.random() * 10000) + 500, // Random budget between 500 and 10500 per SDS (original 1000 + 500)
        startDate: new Date().toISOString(),
        // Set end date to 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending', // Example status
        description: `Load test campaign ${campaignName}`,
    };

    // Record the start time before the request
    const startTime = Date.now();

    // Make the POST request to create the campaign
    const res = post('/campaigns', payload, authToken);

    // Record the end time after the request completes
    const endTime = Date.now();

    // Check if the response status is 201 (Created)
    checkResponse(res, 201);

    // Add data point to the custom metric for campaign creation time
    campaignCreationTime.add(endTime - startTime);

    // Add a sleep period to simulate user think time or pace requests
    sleep(1); // Sleep for 1 second between iterations
}