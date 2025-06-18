import { sleep } from 'k6';
import http from 'k6/http'; // Use k6 http directly
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { landingPageTTFB } from '../../lib/metrics.js';
import { pickRandomFromList } from '../../lib/utils.js';
import { loadTestProfile } from '../../config/scenario_profiles.js'; // Or a lighter profile
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';

// Define a list of sample landing page paths to test.
// These are paths relative to the LANDING_PAGE_BASE_URL.
const landingPagePaths = new SharedArray('landingPagePaths', function () {
    // Example hardcoded list:
    return [
        '/', // Homepage
        '/lp/summer-sale-2024',
        '/lp/new-product-xyz',
        '/lp/contact-us-now',
        '/lp/about-our-company',
    ];
    // Alternatively, load from a CSV file if the list is large or dynamic:
    // const csvData = open('../../data/landing_page_paths.csv'); // Ensure this CSV exists
    // const parsedData = papaparse.parse(csvData, { header: true }).data;
    // return parsedData.map(row => row.path).filter(Boolean); // Assuming CSV has a 'path' column
});

// Merge default thresholds with scenario-specific thresholds
const scenarioThresholds = {
    // Keep relevant global thresholds
    'http_req_failed': defaultThresholds.http_req_failed,
    // Specific threshold for Landing Page Time To First Byte (TTFB)
    'landing_page_ttfb': ['p(95)<300'], // 95% of TTFB should be below 300ms
    // Optionally, total duration for the main HTML document
    'http_req_duration{scenario:landing_page_responsiveness,staticAsset:false}': ['p(95)<500'],
};

// k6 options configuration
export let options = {
    // Using loadTestProfile, can be adjusted (e.g., fewer VUs) based on expected LP traffic
    ...loadTestProfile, 
    thresholds: scenarioThresholds,
    tags: { scenario: 'landing_page_responsiveness' },
};

// Setup function: runs once per test run (optional as per SDS)
// export function setup() {
//   // Could perform initial checks or load more complex data if needed
//   if (landingPagePaths.length === 0) {
//       throw new Error("No landing page paths loaded for testing.");
//   }
//   console.log(`Loaded ${landingPagePaths.length} landing page paths.`);
// }

// Default function: runs for each VU iteration
export default function () {
    const landingPageBaseUrl = ENV_CONFIG.LANDING_PAGE_BASE_URL;
    if (!landingPageBaseUrl) {
        console.error("LANDING_PAGE_BASE_URL is not configured in environments.js");
        // Optionally use k6's fail() to stop the test
        // fail("Missing LANDING_PAGE_BASE_URL configuration"); 
        return;
    }

    if (landingPagePaths.length === 0) {
        console.warn("No landing page paths available to test.");
        return;
    }
    
    const randomLpPath = pickRandomFromList(landingPagePaths);
    const fullUrl = `${landingPageBaseUrl}${randomLpPath.startsWith('/') ? '' : '/'}${randomLpPath}`;

    // Make a GET request to the landing page URL
    const params = {
        tags: { 
            name: fullUrl, // Tag with the specific URL being tested
            staticAsset: false // Differentiate from potential static asset requests if k6 browsers were used
        } 
    };
    const res = http.get(fullUrl, params);

    // Check if the response status is 200 OK and includes basic content
    const success = check(res, {
        'status is 200': (r) => r.status === 200,
        // A more robust check might look for a specific unique element or text
        'body contains <title> tag': (r) => r.body !== null && r.body.includes('<title>'),
        'body is not empty': (r) => r.body !== null && r.body.length > 0,
    });

    // Record the Time To First Byte (TTFB) using the 'waiting' timing
    landingPageTTFB.add(res.timings.waiting);

    if (!success) {
        console.error(`Failed to load landing page ${fullUrl}. Status: ${res.status}`);
    }

    // Simulate user viewing time on the page or time to next action
    sleep(1 + Math.random() * 2); // Sleep for 1-3 seconds
}