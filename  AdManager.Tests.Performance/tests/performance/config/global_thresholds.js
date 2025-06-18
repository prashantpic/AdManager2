export const defaultThresholds = {
    // Global error rate threshold: less than 1% failed requests
    'http_req_failed': [{ threshold: 'rate<0.01', abortOnFail: true }],

    // Global response time thresholds (for all http requests)
    // 95th percentile response time should be below 500ms
    'http_req_duration': ['p(95)<500'],

    // Add other common thresholds as needed, e.g.:
    // 'vus': [{ threshold: 'value>=50', abortOnFail: false }], // Ensure VUs reach a certain level
    // 'checks': ['rate>0.99'], // Overall check success rate > 99%
};