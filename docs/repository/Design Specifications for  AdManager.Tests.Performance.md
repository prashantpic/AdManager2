# AdManager Performance Testing - Software Design Specification (SDS)

## 1. Introduction

This document outlines the software design specification for the `AdManager.Tests.Performance` repository. Its purpose is to define the structure, components, and logic for performance test scripts developed using the k6 framework. These tests aim to validate the non-functional requirements (NFRs) of the Ad Manager Platform, particularly concerning performance, scalability, and stability under various load conditions.

**Key Objectives:**

*   Validate API response times under load (NFR 3.2.1).
*   Assess system scalability, including handling Y million product listings (REQ-PC-010) and N impressions/second (REQ-ARP-005) (NFR 3.2.2).
*   Evaluate system stability during soak tests (NFR 3.2.2).
*   Ensure landing page server-side responsiveness contributes to overall PageSpeed targets (NFR 3.2.1, REQ-6-009).
*   Provide a framework for repeatable and automated performance testing (NFR 5.8).

## 2. System Overview & Architecture

The `AdManager.Tests.Performance` repository contains JavaScript-based test scripts executed by the k6 performance testing tool. These scripts interact with the Ad Manager Platform's API endpoints, simulating various user scenarios and system loads. Results from k6 tests will be output to InfluxDB for visualization and analysis in Grafana.

**Technology Stack:**

*   **Testing Framework:** k6 (v0.49.0 or later)
*   **Language:** JavaScript (ES2022+)
*   **Results Visualization:** Grafana (v10.3.3 or later) via InfluxDB
*   **Dependencies:** k6 core modules, potentially `papaparse` for CSV handling.

## 3. General Performance Testing Strategy

*   **Environment-Specific Configurations:** Tests will be configurable to run against different environments (dev, staging, performance).
*   **Modular Design:** Reusable modules for authentication, HTTP requests, custom metrics, and scenario profiles.
*   **Scenario-Based Testing:** Specific k6 scripts will target different user workflows and API endpoints.
*   **Thresholds:** Performance criteria (e.g., response time p95, error rate) will be defined as k6 thresholds.
*   **Load Profiles:** Standardized load profiles for smoke, load, stress, and soak tests.
*   **Data-Driven Testing:** Where applicable, tests will use external data files (e.g., CSVs for product IDs).
*   **CI/CD Integration:** Tests are intended to be integrated into CI/CD pipelines for automated execution.

## 4. Detailed Design Specifications

### 4.1. `package.json`

*   **Path:** `tests/performance/package.json`
*   **Purpose:** Manages project dependencies, scripts for running tests, linting, and formatting.
*   **Key `scripts`:**
    *   `lint`: "eslint ."
    *   `format`: "prettier --write ."
    *   `test:create_campaign_load`: "k6 run scenarios/campaign_management/create_campaign_load.js"
    *   `test:list_campaigns_stress`: "k6 run scenarios/campaign_management/list_campaigns_stress.js"
    *   `test:product_catalog_scalability`: "k6 run scenarios/product_catalog/list_large_catalog_scalability.js"
    *   `test:impression_load`: "k6 run scenarios/analytics_ingestion/simulate_impression_load.js"
    *   `test:critical_apis_load`: "k6 run scenarios/general_platform/critical_api_endpoints_load.js"
    *   `test:soak`: "k6 run scenarios/general_platform/platform_soak_test.js"
    *   `test:landing_page_responsiveness`: "k6 run scenarios/landing_pages/landing_page_responsiveness.js"
*   **Key `devDependencies`:**
    *   `eslint`
    *   `prettier`
    *   `@types/k6` (for IntelliSense)
    *   `papaparse` (optional, if CSV parsing is complex)
*   **Implemented Features:** Project setup, dependency management.
*   **Requirement IDs:** `5.8 (Performance tests part)`

### 4.2. Configuration (`config/`)

#### 4.2.1. `config/environments.js`

*   **Path:** `tests/performance/config/environments.js`
*   **Purpose:** Provides environment-specific configurations (API URLs, auth details).
*   **Structure:**
    javascript
    // Example structure
    const environments = {
        dev: {
            API_BASE_URL: 'https://dev-api.admanager.example.com/v1',
            AUTH_URL: 'https://dev-auth.admanager.example.com/token',
            // ... other dev-specific params
        },
        staging: {
            API_BASE_URL: 'https://staging-api.admanager.example.com/v1',
            AUTH_URL: 'https://staging-auth.admanager.example.com/token',
            // ... other staging-specific params
        },
        perf: {
            API_BASE_URL: 'https://perf-api.admanager.example.com/v1',
            AUTH_URL: 'https://perf-auth.admanager.example.com/token',
            // ... other perf-specific params
        },
    };

    export const ENV_CONFIG = (() => {
        const env = __ENV.K6_ENV || 'dev'; // K6_ENV is a k6 environment variable
        if (!environments[env]) {
            throw new Error(`Configuration for environment "${env}" not found.`);
        }
        return environments[env];
    })();
    
*   **Implemented Features:** Environment-specific configuration management.
*   **Requirement IDs:** `5.8 (Performance tests part)`

#### 4.2.2. `config/global_thresholds.js`

*   **Path:** `tests/performance/config/global_thresholds.js`
*   **Purpose:** Defines default performance thresholds for k6 tests.
*   **Structure:**
    javascript
    export const defaultThresholds = {
        'http_req_failed': [{ threshold: 'rate<0.01', abortOnFail: true }], // Global error rate < 1%
        'http_req_duration': ['p(95)<500'], // Global 95th percentile response time < 500ms
        // Add other common thresholds as needed
    };
    
*   **Implemented Features:** Centralized default performance threshold definitions.
*   **Requirement IDs:** `3.2.1`, `3.2.2`

#### 4.2.3. `config/scenario_profiles.js`

*   **Path:** `tests/performance/config/scenario_profiles.js`
*   **Purpose:** Defines reusable k6 `options` (stages, VUs, duration) for different test types.
*   **Structure:**
    javascript
    // Example profiles
    export const smokeTestProfile = {
        vus: 1,
        duration: '1m',
    };

    export const loadTestProfile = {
        stages: [
            { duration: '2m', target: 50 }, // Ramp-up to 50 VUs over 2 minutes
            { duration: '5m', target: 50 }, // Stay at 50 VUs for 5 minutes
            { duration: '1m', target: 0 },  // Ramp-down to 0 VUs over 1 minute
        ],
    };

    export const stressTestProfile = {
        stages: [
            { duration: '1m', target: 20 },
            { duration: '2m', target: 20 },
            { duration: '1m', target: 50 },
            { duration: '2m', target: 50 },
            { duration: '1m', target: 100 },
            { duration: '2m', target: 100 },
            { duration: '2m', target: 0 }, // Ramp down
        ],
    };

    export const soakTestProfile = {
        stages: [
            { duration: '5m', target: 30 },  // Ramp up to a moderate load
            { duration: '4h', target: 30 }, // Sustain load for 4 hours
            { duration: '5m', target: 0 },  // Ramp down
        ],
        gracefulStop: '5m', // ensure VUs complete iterations
    };
    
*   **Implemented Features:** Reusable load profile configurations.
*   **Requirement IDs:** `5.8 (Performance tests part)`

### 4.3. Test Data (`data/`)

#### 4.3.1. `data/sample_product_ids.csv`

*   **Path:** `tests/performance/data/sample_product_ids.csv`
*   **Purpose:** Provides sample product IDs for tests involving product catalog interactions.
*   **Format:**
    csv
    productId
    product-uuid-001
    product-uuid-002
    product-uuid-003
    ...
    
*   **Usage:** Loaded into k6 scripts using `SharedArray` or `papaparse`.
    javascript
    // Example usage in a k6 script
    // import { SharedArray } from 'k6/data';
    // const productIds = new SharedArray('productIds', function () {
    //   return open('./../data/sample_product_ids.csv').split('\n').slice(1).filter(Boolean); // Read CSV, skip header
    // });
    
*   **Implemented Features:** Test data for product-related scenarios.
*   **Requirement IDs:** `REQ-PC-010`

### 4.4. Helper Libraries (`lib/`)

#### 4.4.1. `lib/auth.js`

*   **Path:** `tests/performance/lib/auth.js`
*   **Purpose:** Handles authentication and token management.
*   **Functions:**
    *   `getAuthToken(username, password)`:
        *   **Logic:**
            1.  Retrieves `AUTH_URL` from `ENV_CONFIG`.
            2.  Sends a POST request to `AUTH_URL` with `username` and `password` (e.g., as form-data or JSON).
            3.  Expects a JSON response containing an access token (e.g., `{"access_token": "..."}`).
            4.  Extracts and returns the access token.
            5.  Handles authentication errors and throws an exception if auth fails.
        *   **Parameters:** `username` (string), `password` (string).
        *   **Return Type:** `Promise<string>` (the access token).
*   **Implemented Features:** Reusable authentication logic.
*   **Requirement IDs:** `5.8 (Performance tests part)`

#### 4.4.2. `lib/http.js`

*   **Path:** `tests/performance/lib/http.js`
*   **Purpose:** Provides wrapper functions for k6 `http` module with common configurations.
*   **Dependencies:** `k6/http`, `k6`, `../config/environments.js`
*   **Functions:**
    *   `get(urlPath, authToken, params = null)`:
        *   **Logic:**
            1.  Constructs the full URL: `ENV_CONFIG.API_BASE_URL + urlPath`.
            2.  Prepares headers: `{'Content-Type': 'application/json', 'Authorization': \`Bearer ${authToken}\`}`.
            3.  Makes an HTTP GET request using `http.get()`.
            4.  Returns the k6 response object.
        *   **Parameters:** `urlPath` (string), `authToken` (string), `params` (object, optional k6 params).
        *   **Return Type:** `Object` (k6 response object).
    *   `post(urlPath, payload, authToken, params = null)`:
        *   **Logic:** Similar to `get`, but makes an HTTP POST request with `JSON.stringify(payload)`.
        *   **Parameters:** `urlPath` (string), `payload` (object), `authToken` (string), `params` (object, optional k6 params).
        *   **Return Type:** `Object` (k6 response object).
    *   `put(urlPath, payload, authToken, params = null)`: (Similar for PUT)
    *   `del(urlPath, authToken, params = null)`: (Similar for DELETE)
    *   `checkResponse(response, expectedStatus, customCheckFn = null)`:
        *   **Logic:**
            1.  Uses `check()` from `k6`.
            2.  Checks `response.status === expectedStatus`.
            3.  Optionally, executes `customCheckFn(response)` if provided.
            4.  Returns `true` if all checks pass, `false` otherwise. Logs failures.
        *   **Parameters:** `response` (object), `expectedStatus` (number), `customCheckFn` (function, optional).
        *   **Return Type:** `boolean`.
*   **Implemented Features:** Standardized HTTP request functions.
*   **Requirement IDs:** `5.8 (Performance tests part)`

#### 4.4.3. `lib/metrics.js`

*   **Path:** `tests/performance/lib/metrics.js`
*   **Purpose:** Defines custom k6 metrics for detailed measurements.
*   **Dependencies:** `k6/metrics`
*   **Structure:**
    javascript
    import { Trend, Rate, Counter, Gauge } from 'k6/metrics';

    export const campaignCreationTime = new Trend('campaign_creation_time', true); // measures time in ms
    export const productSearchLatency = new Trend('product_search_latency', true);
    export const impressionApiErrorRate = new Rate('impression_api_error_rate');
    export const landingPageTTFB = new Trend('landing_page_ttfb', true);
    // Add other custom metrics relevant to requirements
    // e.g., REQ-ARP-005 analytics processing specific metrics if testable endpoint exists
    export const analyticsProcessingTime = new Trend('analytics_processing_time', true); // Hypothetical
    export const catalogLargeListResponseTime = new Trend('catalog_large_list_response_time', true); // For REQ-PC-010
    
*   **Implemented Features:** Custom performance metric definitions.
*   **Requirement IDs:** `REQ-ARP-005`, `REQ-PC-010`, `3.2.1`

#### 4.4.4. `lib/utils.js`

*   **Path:** `tests/performance/lib/utils.js`
*   **Purpose:** Generic utility functions.
*   **Functions:**
    *   `generateRandomString(length, charset = "abcdefghijklmnopqrstuvwxyz0123456789")`:
        *   **Logic:** Generates a random string of specified `length` using `charset`.
        *   **Parameters:** `length` (number), `charset` (string, optional).
        *   **Return Type:** `string`.
    *   `pickRandomFromList(list)`:
        *   **Logic:** Returns a random element from the input `list`.
        *   **Parameters:** `list` (array).
        *   **Return Type:** `any`.
    *   `uuidv4()`:
        *   **Logic:** Generates a UUID v4 string. (k6 does not have a built-in UUID generator, so this might use a simple JS implementation or rely on a pre-generated list if truly random UUIDs are not strictly needed for test uniqueness but rather for format). For truly random, a small library snippet might be included here.
        *   **Parameters:** None.
        *   **Return Type:** `string`.
*   **Implemented Features:** Common helper functions.
*   **Requirement IDs:** `5.8 (Performance tests part)`

### 4.5. Test Scenarios (`scenarios/`)

#### 4.5.1. `scenarios/campaign_management/create_campaign_load.js`

*   **Purpose:** Load test campaign creation API (NFR 3.2.1).
*   **`options`:**
    *   Merge `loadTestProfile` from `scenario_profiles.js`.
    *   Merge `defaultThresholds` from `global_thresholds.js`.
    *   Specific thresholds for this scenario: `campaign_creation_time: ['p(95)<1000']` (e.g., 95% of creations < 1s).
*   **`setup()`:**
    *   Call `auth.getAuthToken()` with test user credentials (e.g., from `__ENV.K6_USER_1`, `__ENV.K6_PASSWORD_1`).
    *   Return `{ authToken: token }`.
*   **`default(data)`:**
    1.  Generate unique campaign payload:
        javascript
        const campaignName = `PerfTestCampaign-${utils.generateRandomString(8)}-${__VU}-${__ITER}`;
        const payload = {
            name: campaignName,
            budgetTarget: Math.floor(Math.random() * 1000) + 500,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            // ... other required fields
        };
        
    2.  Record start time: `const startTime = Date.now();`
    3.  Call `http.post('/campaigns', payload, data.authToken)`.
    4.  Record end time: `const endTime = Date.now();`
    5.  Use `http.checkResponse(res, 201)` to verify success.
    6.  Record custom metric: `metrics.campaignCreationTime.add(endTime - startTime);`
    7.  `sleep(1)` for pacing.
*   **Implemented Features:** Load testing of campaign creation.
*   **Requirement IDs:** `3.2.1`, `5.8 (Performance tests part)`

#### 4.5.2. `scenarios/campaign_management/list_campaigns_stress.js`

*   **Purpose:** Stress test campaign listing API (NFR 3.2.1, 3.2.2).
*   **`options`:**
    *   Merge `stressTestProfile` from `scenario_profiles.js`.
    *   Merge `defaultThresholds`.
    *   Thresholds might focus on error rates under high stress: `http_req_failed: ['rate<0.05']`.
*   **`setup()`:**
    *   Call `auth.getAuthToken()`.
*   **`default(data)`:**
    1.  Call `http.get('/campaigns?page=1&limit=20', data.authToken)`.
    2.  Use `http.checkResponse(res, 200)`.
    3.  Optionally, record response time if Trend metric defined.
    4.  `sleep(0.5)`.
*   **Implemented Features:** Stress testing of campaign listing.
*   **Requirement IDs:** `3.2.1`, `3.2.2`, `5.8 (Performance tests part)`

#### 4.5.3. `scenarios/product_catalog/list_large_catalog_scalability.js`

*   **Purpose:** Scalability test for product catalog listing/searching with Y million listings (REQ-PC-010, NFR 3.2.2).
*   **Important Note:** This test relies heavily on the test environment having a sufficiently large product catalog dataset or the API supporting queries that simulate this scale.
*   **`options`:**
    *   A custom scalability profile (e.g., sustained load for a duration, gradually increasing VUs).
        javascript
        // Example options
        // stages: [
        //     { duration: '5m', target: 20 },
        //     { duration: '10m', target: 20 },
        //     { duration: '5m', target: 0 },
        // ],
        
    *   Thresholds: `defaultThresholds`, `metrics.catalogLargeListResponseTime: ['p(95)<2000']` (e.g. 2s for large catalog).
*   **`setup()`:**
    *   Call `auth.getAuthToken()`.
    *   Load `sample_product_ids.csv` into a `SharedArray` if performing searches using specific IDs.
*   **`default(data)`:**
    1.  Simulate listing or searching:
        *   `http.get('/products?limit=100&offset=...', data.authToken)` to simulate pagination through a large list. Offset should be varied.
        *   Alternatively, if searching: `const randomProductId = utils.pickRandomFromList(productIdsFromSetup); http.get(\`/products?searchQuery=${randomProductId}\`, data.authToken);`
    2.  `http.checkResponse(res, 200)`.
    3.  Record `metrics.catalogLargeListResponseTime.add(res.timings.duration)`.
    4.  `sleep(1)`.
*   **Implemented Features:** Scalability testing of product catalog operations.
*   **Requirement IDs:** `REQ-PC-010`, `3.2.2`, `5.8 (Performance tests part)`

#### 4.5.4. `scenarios/analytics_ingestion/simulate_impression_load.js`

*   **Purpose:** Load test analytics impression ingestion API for N impressions/second (REQ-ARP-005, NFR 3.2.2).
*   **`options`:**
    *   `rps`: Target N (e.g., if N=1000, `rps: 1000`).
    *   `vus`: Sufficient VUs to achieve RPS (e.g., `vus: 50` if each VU can do 20 req/s).
    *   `duration`: e.g., `'5m'`.
    *   `thresholds`: `defaultThresholds`, `metrics.impressionApiErrorRate: ['rate<0.001']` (very low error rate for ingestion).
*   **`setup()`:**
    *   (Optional) If impressions require auth, get token. Usually, impression/pixel endpoints are unauthenticated or use API keys. Assume API key is passed via ENV or embedded.
*   **`default()`:**
    1.  Generate sample impression payload:
        javascript
        const payload = {
            timestamp: new Date().toISOString(),
            campaignId: `camp-${utils.uuidv4()}`, // Or pick from a list
            adId: `ad-${utils.uuidv4()}`,
            userId: `user-${utils.generateRandomString(10)}`,
            eventType: 'impression',
            // ... other relevant fields
        };
        
    2.  Send POST request: `const res = http.post(ENV_CONFIG.IMPRESSION_INGESTION_URL, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json', 'X-Api-Key': __ENV.IMPRESSION_API_KEY } });` (Adjust auth as needed).
    3.  `check(res, { 'status is 202 or 200': (r) => r.status === 202 || r.status === 200 });`
    4.  `metrics.impressionApiErrorRate.add(res.status !== 202 && res.status !== 200);`
    5.  No `sleep()` is typically used when targeting RPS.
*   **Implemented Features:** Load generation for analytics impression ingestion.
*   **Requirement IDs:** `REQ-ARP-005`, `3.2.2`, `5.8 (Performance tests part)`
*   **Note:** This script tests the ingestion API's capacity to *accept* N impressions/sec. Backend processing latency (Y/Z from REQ-ARP-005) needs to be measured via backend monitoring (e.g., CloudWatch metrics on SQS queue age, Lambda duration, time to data visibility in DynamoDB/reports).

#### 4.5.5. `scenarios/general_platform/critical_api_endpoints_load.js`

*   **Purpose:** Load test a mix of critical APIs for overall platform performance (NFR 3.2.1).
*   **`options`:**
    *   Merge `loadTestProfile`.
    *   Merge `defaultThresholds`.
    *   Specific thresholds for critical operations.
*   **`setup()`:**
    *   Call `auth.getAuthToken()`.
*   **`default(data)`:**
    *   Use k6 `group` to structure different user actions:
        javascript
        group('Dashboard Load', function () {
            const res = http.get('/dashboard/summary', data.authToken);
            http.checkResponse(res, 200);
            // record metric for dashboard load time
        });
        sleep(1);

        group('View Campaign List', function () {
            const res = http.get('/campaigns?limit=10', data.authToken);
            http.checkResponse(res, 200);
            // record metric
        });
        sleep(1);

        group('Update User Setting', function () {
            const payload = { theme: 'dark' };
            const res = http.put('/user/settings', payload, data.authToken);
            http.checkResponse(res, 200);
            // record metric
        });
        sleep(1);
        
*   **Implemented Features:** Load testing of various critical platform APIs.
*   **Requirement IDs:** `3.2.1`, `5.8 (Performance tests part)`

#### 4.5.6. `scenarios/general_platform/platform_soak_test.js`

*   **Purpose:** Soak test for platform stability and resource consumption over extended periods (NFR 3.2.2).
*   **`options`:**
    *   Merge `soakTestProfile`.
    *   Merge `defaultThresholds`. Thresholds should ensure no degradation over time (e.g., p95 response time remains stable, error rate stays low).
*   **`setup()`:**
    *   Call `auth.getAuthToken()`.
*   **`default(data)`:**
    *   Similar to `critical_api_endpoints_load.js`, execute a mix of common API calls representing typical user activity.
    *   `sleep()` calls should reflect realistic user think times.
    *   Focus is on sustained load and monitoring for:
        *   Increasing error rates.
        *   Degrading response times.
        *   Backend system resource exhaustion (CPU, memory, connections - monitored via CloudWatch).
*   **Implemented Features:** Long-duration stability testing.
*   **Requirement IDs:** `3.2.2`, `5.8 (Performance tests part)`

#### 4.5.7. `scenarios/landing_pages/landing_page_responsiveness.js`

*   **Purpose:** Measure server-side response times for landing pages (contributes to NFR 3.2.1 & REQ-6-009 PageSpeed).
*   **`options`:**
    *   Merge `loadTestProfile` (or a lighter profile).
    *   Merge `defaultThresholds`.
    *   Specific thresholds: `metrics.landingPageTTFB: ['p(95)<300']`.
*   **`setup()`:**
    *   (Optional) Load a list of sample landing page URLs (e.g., from a CSV or hardcoded list for testing). Assume landing pages are publicly accessible or use appropriate auth if needed.
    javascript
    // const landingPageUrls = new SharedArray('landingPageUrls', function () {
    //   return ['/lp/summer-sale', '/lp/new-product-launch']; // Example relative paths
    // });
    
*   **`default()`:** // or `default(data)` if auth is needed
    1.  Select a landing page URL (e.g., `utils.pickRandomFromList(landingPageUrls)`).
    2.  Make a GET request to the landing page URL. (Note: This is for the HTML document, not necessarily all sub-resources like a browser would fetch).
        `const res = http.get(ENV_CONFIG.LANDING_PAGE_BASE_URL + randomLpPath);`
    3.  `http.checkResponse(res, 200, (r) => r.body.includes('<title>'))`; // Basic content check
    4.  Record TTFB: `metrics.landingPageTTFB.add(res.timings.waiting);` (k6 `waiting` time is TTFB).
    5.  `sleep(1)`.
*   **Implemented Features:** Server response time testing for landing pages.
*   **Requirement IDs:** `3.2.1`, `5.8 (Performance tests part)`
*   **Note:** This test measures server performance. Full PageSpeed Insights validation (REQ-6-009) requires browser-based tools and would be a separate test activity, though server responsiveness is a key input.

### 4.6. Results Configuration (`results_config/`)

#### 4.6.1. `results_config/influxdb_output.js`

*   **Path:** `tests/performance/results_config/influxdb_output.js`
*   **Purpose:** Not a runnable script, but a conceptual module illustrating how InfluxDB output can be configured. The actual configuration is usually done via k6 command-line arguments or environment variables for `handleSummary` or k6's native InfluxDB output.
*   **Conceptual Structure (for documentation/reference):**
    javascript
    // This file is for documentation purposes to show how one might structure
    // InfluxDB connection details if used within a JS setup for k6 Cloud or handleSummary.
    // For local k6 runs, use: k6 run --out influxdb=http://<influxdb_host>:8086/<database_name> your_script.js

    export const influxDBConnectionDetails = {
        addr: __ENV.K6_INFLUXDB_ADDR || 'http://localhost:8086',
        token: __ENV.K6_INFLUXDB_TOKEN || 'YOUR_INFLUXDB_TOKEN',
        bucket: __ENV.K6_INFLUXDB_BUCKET || 'k6_results',
        org: __ENV.K6_INFLUXDB_ORG || 'your_org',
        // Additional tags can be configured here or via k6 options
        tags: {
            test_run_id: __ENV.K6_TEST_RUN_ID || new Date().toISOString(),
        },
    };
    
*   **Implemented Features:** Configuration for k6 results export to InfluxDB.
*   **Requirement IDs:** `5.8 (Performance tests part)`
*   **Note:** This mainly serves as a placeholder to document InfluxDB integration. Actual output is configured via k6 execution options. A `handleSummary(data)` function in scripts could use these details to push custom summary data if needed.

## 5. Grafana Dashboards (Conceptual)

While Grafana dashboard configurations are typically outside the k6 script repository, the performance testing strategy relies on Grafana for visualization. Dashboards will be created in Grafana to:

*   Display time-series data for standard k6 metrics (RPS, VUs, HTTP request duration, error rates).
*   Visualize custom metrics defined in `lib/metrics.js` (e.g., `campaignCreationTime`, `productSearchLatency`).
*   Filter data by test script, scenario, or custom tags.
*   Compare performance across different test runs.
*   Monitor thresholds and alert statuses.

Key panels would include:
*   Request Rate (RPS)
*   Virtual Users (VUs)
*   HTTP Request Duration (p90, p95, p99, avg)
*   HTTP Fail Rate
*   Custom Trend Metrics (e.g., `campaign_creation_time` over time)

## 6. Execution and Reporting

*   **Execution:** k6 scripts will be executed via the command line or CI/CD pipeline. Environment variables (`K6_ENV`, `K6_USER_X`, `K6_PASSWORD_X`, InfluxDB vars) will be used to parameterize runs.
*   **Reporting:**
    *   k6 provides a summary report to stdout.
    *   Metrics will be pushed to InfluxDB in real-time (or near real-time).
    *   Grafana dashboards will provide rich visualization and historical analysis of performance data.
    *   `handleSummary(data)` function can be used in k6 scripts to generate custom JSON/HTML reports if needed.

javascript
// Example handleSummary in a k6 script for custom reporting
// export function handleSummary(data) {
//   console.log('Finished executing performance test');
//   // Example: return a JSON summary
//   return {
//     'summary.json': JSON.stringify(data),
//   };
// }


This structured approach ensures that performance tests are comprehensive, maintainable, and provide actionable insights into the Ad Manager Platform's capabilities.