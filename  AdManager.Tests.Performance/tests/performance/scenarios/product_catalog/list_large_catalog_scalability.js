import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { getAuthToken } from '../../lib/auth.js';
import { get, checkResponse } from '../../lib/http.js';
import { pickRandomFromList } from '../../lib/utils.js';
import { catalogLargeListResponseTime, productSearchLatency } from '../../lib/metrics.js';
import { defaultThresholds } from '../../config/global_thresholds.js';
import { ENV_CONFIG } from '../../config/environments.js';

// Load product IDs from the CSV using SharedArray for efficiency
const productIdsData = new SharedArray('productIds', function () {
    const csvData = open('../../data/sample_product_ids.csv');
    // Papaparse expects a string, ensure 'open' returns string content
    const parsed = papaparse.parse(csvData, { header: true });
    // Filter out any empty rows or rows that failed parsing, and map to just the ID
    return parsed.data.filter(row => row && row.productId).map(row => row.productId);
});

// Define a custom scalability test profile or use a variation of existing ones
const scalabilityProfile = {
    stages: [
        { duration: '5m', target: 20 },  // Initial ramp-up
        { duration: '10m', target: 20 }, // Sustained load
        { duration: '5m', target: 0 },   // Ramp down
    ],
    gracefulStop: '2m',
};

// Merge default thresholds with scenario-specific thresholds
const scenarioThresholds = {
    ...defaultThresholds,
    'catalog_large_list_response_time': ['p(95)<2000'], // 95% of large catalog listings < 2s
    'product_search_latency': ['p(95)<1500'], // If specific search is tested
};

// k6 options configuration
export let options = {
    ...scalabilityProfile,
    thresholds: scenarioThresholds,
    tags: { scenario: 'product_catalog_scalability' },
};

// Setup function: runs once per test run
export function setup() {
    console.log(`Running setup for product_catalog_scalability against ${ENV_CONFIG.API_BASE_URL}`);
    const authToken = getAuthToken(__ENV.K6_USER_1, __ENV.K6_PASSWORD_1);
    console.log("Setup complete: Auth token obtained.");
    if (productIdsData.length === 0) {
        console.warn("Warning: No product IDs loaded from sample_product_ids.csv. Search functionality may not be fully tested.");
    } else {
        console.log(`Loaded ${productIdsData.length} product IDs for testing.`);
    }
    return { authToken: authToken, productIds: productIdsData };
}

// Default function: runs for each VU iteration
export default function (data) {
    const authToken = data.authToken;

    // Simulate listing products (pagination through a large list)
    // The offset should be varied to simulate accessing different parts of a large catalog
    // Assuming a max of Y million items (e.g., Y=1), and limit 100
    const maxItems = 1000000; // Example: 1 million items
    const limit = 100;
    const randomOffset = Math.floor(Math.random() * (maxItems - limit > 0 ? maxItems - limit : 0));
    
    const listPath = `/products?limit=${limit}&offset=${randomOffset}`;
    const listRes = get(listPath, authToken);
    checkResponse(listRes, 200);
    catalogLargeListResponseTime.add(listRes.timings.duration);

    sleep(0.5); // Brief pause

    // Simulate searching for a specific product if IDs are available
    if (data.productIds && data.productIds.length > 0) {
        const randomProductId = pickRandomFromList(data.productIds);
        // Assuming search by ID is /products/{id} or /products?searchQuery={id}
        // Adjust endpoint as per actual API design
        const searchPathById = `/products/${randomProductId}`; // Example: fetching a specific product by ID
        // const searchPathByQuery = `/products?searchQuery=${randomProductId}`; // Example: search query

        const searchRes = get(searchPathById, authToken); // Or use searchPathByQuery
        // Check might be 200 (found) or 404 (if ID is not guaranteed to exist in test dataset for a general search)
        // For simplicity, assuming 200 for direct fetch if ID is from a known list.
        checkResponse(searchRes, 200); 
        productSearchLatency.add(searchRes.timings.duration);
    }

    sleep(1); // Sleep for 1 second
}