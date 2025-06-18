import { sleep, group } from 'k6';
import { getAuthToken } from '../../lib/auth.js';
import { get, put, checkResponse } from '../../lib/http.js'; // Assuming POST is not needed for this scenario's example flows
import { dashboardLoadTime, viewCampaignListTime, updateUserSettingTime } from '../../lib/metrics.js';
import { loadTestProfile } from '../../config/scenario_profiles.js';
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';
import { pickRandomFromList } from '../../lib/utils.js';

// Merge default thresholds with scenario-specific thresholds
const scenarioThresholds = {
    ...defaultThresholds,
    'dashboard_load_time': ['p(95)<700'],       // Example: 95% of dashboard loads < 700ms
    'view_campaign_list_time': ['p(95)<600'],   // Example: 95% of campaign list views < 600ms
    'update_user_setting_time': ['p(95)<500'], // Example: 95% of user setting updates < 500ms
};

// k6 options configuration
export let options = {
    ...loadTestProfile, // Use the predefined load test profile
    thresholds: scenarioThresholds,
    tags: { scenario: 'critical_apis_load' },
};

// Setup function: runs once per test run
export function setup() {
    console.log(`Running setup for critical_api_endpoints_load against ${ENV_CONFIG.API_BASE_URL}`);
    const authToken = getAuthToken(__ENV.K6_USER_1, __ENV.K6_PASSWORD_1);
    console.log("Setup complete: Auth token obtained.");
    return { authToken: authToken };
}

// Default function: runs for each VU iteration
export default function (data) {
    const authToken = data.authToken;

    group('Dashboard Load', function () {
        const startTime = Date.now();
        const res = get('/dashboard/summary', authToken); // Example dashboard endpoint
        const endTime = Date.now();
        checkResponse(res, 200);
        dashboardLoadTime.add(endTime - startTime);
    });

    sleep(1 + Math.random()); // Simulate user thinking time 1-2s

    group('View Campaign List', function () {
        const startTime = Date.now();
        // Example: View first page of 10 campaigns
        const res = get('/campaigns?limit=10&page=1', authToken);
        const endTime = Date.now();
        checkResponse(res, 200);
        viewCampaignListTime.add(endTime - startTime);
    });

    sleep(1 + Math.random()); // Simulate user thinking time 1-2s

    group('Update User Setting', function () {
        const themes = ['dark', 'light', 'system'];
        const payload = { 
            theme: pickRandomFromList(themes),
            notifications: {
                email: Math.random() < 0.5, // 50% chance of true/false
                sms: Math.random() < 0.2 // 20% chance of true
            }
        };
        const startTime = Date.now();
        const res = put('/user/settings', payload, authToken); // Example user settings endpoint
        const endTime = Date.now();
        checkResponse(res, 200); // Assuming 200 OK on successful update
        updateUserSettingTime.add(endTime - startTime);
    });

    sleep(2 + Math.random() * 2); // Overall sleep at the end of iteration (2-4s)
}