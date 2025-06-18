import { sleep, group } from 'k6';
import { getAuthToken } from '../../lib/auth.js';
import { get, post, put, checkResponse } from '../../lib/http.js'; // Include methods used in typical activities
import { dashboardLoadTime, viewCampaignListTime, campaignCreationTime } from '../../lib/metrics.js'; // Reuse relevant metrics
import { soakTestProfile } from '../../config/scenario_profiles.js';
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';
import { generateRandomString, pickRandomFromList } from '../../lib/utils.js';

// Soak test thresholds ensure stability over time.
const scenarioThresholds = {
    ...defaultThresholds,
    'http_req_duration': ['p(95)<1000'], // Response times should remain stable and not degrade
    'http_req_failed': ['rate<0.005'],  // Very low error rate throughout the test
    'dashboard_load_time': ['p(95)<1200'],
    'view_campaign_list_time': ['p(95)<800'],
    'campaign_creation_time': ['p(95)<1500'], // If creation is part of the soak
};

// k6 options configuration
export let options = {
    ...soakTestProfile, // Use the predefined soak test profile
    thresholds: scenarioThresholds,
    tags: { scenario: 'platform_soak_test' },
};

// Setup function: runs once per test run
export function setup() {
    console.log(`Running setup for platform_soak_test against ${ENV_CONFIG.API_BASE_URL}`);
    const authToken = getAuthToken(__ENV.K6_USER_1, __ENV.K6_PASSWORD_1);
    console.log("Setup complete: Auth token obtained.");
    return { authToken: authToken };
}

// Default function: runs for each VU iteration
export default function (data) {
    const authToken = data.authToken;

    // Simulate a mix of common, repeatable user actions.
    // Avoid actions that excessively create data unless that's part of the test objective.
    // Focus on read operations and light write/update operations.

    group('Check Dashboard', function () {
        const startTime = Date.now();
        const res = get('/dashboard/summary', authToken);
        const endTime = Date.now();
        checkResponse(res, 200);
        dashboardLoadTime.add(endTime - startTime);
    });

    sleep(5 + Math.random() * 5); // Simulate user viewing dashboard (5-10s)

    group('Browse Campaigns', function () {
        const startTime = Date.now();
        const page = Math.floor(Math.random() * 5) + 1; // Randomly view one of the first 5 pages
        const res = get(`/campaigns?limit=10&page=${page}`, authToken);
        const endTime = Date.now();
        checkResponse(res, 200);
        viewCampaignListTime.add(endTime - startTime);
    });

    sleep(5 + Math.random() * 5); // Simulate browsing (5-10s)

    // Optionally, include a light write operation if it's common and doesn't bloat data too much
    // Example: Update a user preference infrequently
    if (Math.random() < 0.1) { // 10% chance per iteration to perform this
        group('Update User Setting (Infrequent)', function () {
            const themes = ['dark', 'light', 'system_default'];
            const payload = { theme: pickRandomFromList(themes) };
            const res = put('/user/settings', payload, authToken);
            checkResponse(res, 200);
        });
        sleep(2 + Math.random());
    }
    
    // Example: Create a campaign infrequently for soak tests if this is a critical flow to monitor over time
    // Be mindful of data accumulation. This might be better as a separate, more controlled soak test.
    /*
    if (Math.random() < 0.05) { // 5% chance
        group('Create Campaign (Infrequent)', function () {
            const campaignName = `SoakTestCampaign-${generateRandomString(6)}-${__VU}-${__ITER}`;
            const payload = {
                name: campaignName,
                budgetTarget: Math.floor(Math.random() * 1000) + 100,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            };
            const startTime = Date.now();
            const res = post('/campaigns', payload, authToken);
            const endTime = Date.now();
            checkResponse(res, 201);
            campaignCreationTime.add(endTime - startTime);
        });
        sleep(2 + Math.random());
    }
    */

    // Overall sleep at the end of the iteration to represent user being idle or away
    sleep(10 + Math.random() * 10); // Longer idle time (10-20s)
}