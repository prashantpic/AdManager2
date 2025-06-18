// Define reusable k6 options (stages, VUs, duration) for different test types

export const smokeTestProfile = {
    vus: 1,
    duration: '1m',
    // iterations: 1, // Alternative for very short smoke tests
};

export const loadTestProfile = {
    stages: [
        { duration: '2m', target: 50 }, // Ramp-up to 50 VUs over 2 minutes
        { duration: '5m', target: 50 }, // Stay at 50 VUs for 5 minutes
        { duration: '1m', target: 0 },  // Ramp-down to 0 VUs over 1 minute
    ],
    gracefulRampDown: '30s', // Allow VUs to finish iterations during ramp-down
};

export const stressTestProfile = {
    stages: [
        { duration: '1m', target: 20 },  // Baseline load
        { duration: '2m', target: 20 },
        { duration: '1m', target: 50 },  // Increased load
        { duration: '2m', target: 50 },
        { duration: '1m', target: 100 }, // Stress load
        { duration: '2m', target: 100 },
        { duration: '2m', target: 0 },   // Ramp down
    ],
    gracefulRampDown: '60s',
};

export const soakTestProfile = {
    stages: [
        { duration: '5m', target: 30 },  // Ramp up to a moderate, sustainable load
        { duration: '4h', target: 30 }, // Sustain load for 4 hours
        { duration: '5m', target: 0 },  // Ramp down
    ],
    gracefulRampDown: '5m', // Allow VUs to finish current iterations during ramp-down
    gracefulStop: '5m',     // Ensure all VUs complete their final iteration before k6 exits
};

// Example of an RPS-based profile, useful for ingestion or fixed throughput tests
export const rpsTargetProfile = (targetRps, duration, preAllocatedVUs = 50, maxVUs = 200) => ({
    executor: 'constant-arrival-rate',
    rate: targetRps,      // Target RPS
    timeUnit: '1s',       // Per second
    duration: duration,
    preAllocatedVUs: preAllocatedVUs, // Number of VUs to pre-allocate
    maxVUs: maxVUs,           // Maximum number of VUs k6 can use
});