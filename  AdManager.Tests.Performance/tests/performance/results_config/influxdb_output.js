// This file serves as documentation and a potential source of configuration
// details if needed within k6 scripts (e.g., for handleSummary or k6 Cloud options).
//
// For standard k6 execution with InfluxDB output, you typically use
// command-line flags or environment variables.
//
// InfluxDB v1 Example:
//   k6 run --out influxdb=http://<influxdb_host>:8086/<database_name> your_script.js
//
// InfluxDB v2 Example (Recommended):
//   k6 run --out 'influxdb=http://<influxdb_host>:8086?bucket=<bucket_name>&org=<org_name>&token=<token>' your_script.js
//
// Or using k6 environment variables (ensure these are set in your execution environment):
//   K6_OUT='influxdb=http://${K6_INFLUXDB_ADDR:-localhost:8086}?bucket=${K6_INFLUXDB_BUCKET:-k6_results}&org=${K6_INFLUXDB_ORG:-your_org}&token=${K6_INFLUXDB_TOKEN}' k6 run your_script.js

/**
 * Conceptual object representing InfluxDB connection details.
 * These details are usually provided via K6_OUT environment variable
 * or k6 command-line flags, but are documented here for reference.
 * If using a handleSummary function to manually push data, or configuring k6 Cloud,
 * you might use these values accessed via `__ENV`.
 */
export const influxDBConnectionDetails = {
    // InfluxDB v2 style is preferred:
    addr: __ENV.K6_INFLUXDB_ADDR || 'http://localhost:8086', // Your InfluxDB instance address (e.g., 'http://influxdb.example.com:8086')
    token: __ENV.K6_INFLUXDB_TOKEN || 'YOUR_INFLUXDB_API_TOKEN', // The API token for authentication with InfluxDB v2
    bucket: __ENV.K6_INFLUXDB_BUCKET || 'k6_results',         // The InfluxDB bucket where results will be stored
    org: __ENV.K6_INFLUXDB_ORG || 'your_influxdb_org_name',    // Your InfluxDB organization name or ID

    // For InfluxDB v1 (less common for new setups):
    // database: __ENV.K6_INFLUXDB_DATABASE || 'k6_results_v1',
    // username: __ENV.K6_INFLUXDB_USERNAME, // Optional, if auth enabled on v1
    // password: __ENV.K6_INFLUXDB_PASSWORD, // Optional, if auth enabled on v1

    // Additional tags to add to all metrics pushed from this k6 run.
    // These are extremely useful for filtering and organizing data in Grafana.
    // They can also be set globally in k6 script options `tags: { ... }`
    // or per-request/group.
    // The `K6_INFLUXDB_TAGS_AS_FIELDS` env var can control how tags are written.
    tags: {
        sourceSystem: 'AdManagerPerformanceTests',
        testRunId: __ENV.K6_TEST_RUN_ID || `manual-${new Date().toISOString()}`, // A unique ID for each test execution
        environment: __ENV.K6_ENV || 'unknown', // e.g., 'dev', 'staging', 'perf'
        // gitCommit: __ENV.GIT_COMMIT_SHA, // Example: If running in CI, pass the commit hash
        // buildNumber: __ENV.CI_BUILD_NUMBER, // Example: If running in CI, pass the build number
        // testScenario: __ENV.K6_SCRIPT_NAME, // k6 will often add scenario tag automatically
    },

    // Default push interval for k6 metrics to InfluxDB (in seconds)
    // Can be configured via K6_INFLUXDB_PUSH_INTERVAL env var (e.g., "1s", "5s")
    // pushInterval: __ENV.K6_INFLUXDB_PUSH_INTERVAL || '5s',
};

// This file does not export a runnable k6 function (like default, setup, handleSummary etc.)
// Its primary purpose is to document the InfluxDB output configuration strategy
// and provide a reference structure for environment variables.
// Actual k6 output configuration occurs via CLI arguments or environment variables
// that k6 itself reads.

/*
// Example of how handleSummary *could* potentially interact with such configuration
// (Note: This is illustrative. k6's native `--out influxdb` is the primary method for sending metrics.)

import { textSummary } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js'; // For default summary output
// import http from 'k6/http'; // If you were to manually POST summary data

export function handleSummary(data) {
    console.log(`Test run finished. Test environment: ${influxDBConnectionDetails.tags.environment}`);
    console.log(`Results for test run ID: ${influxDBConnectionDetails.tags.testRunId}`);

    // If you needed to send a custom summary payload somewhere (e.g., a custom reporting API)
    // you could construct it here and use http.post.
    // This is NOT for sending k6 metrics to InfluxDB, k6 does that automatically with --out.

    // Example: Create a summary.json file
    // return {
    //     'stdout': textSummary(data, { indent: '  ', enableColors: true }),
    //     'summary.json': JSON.stringify(data), // Save full data to a file
    // };

    // Default summary to console
    return {
        'stdout': textSummary(data, { indent: '  ', enableColors: true }),
    };
}
*/