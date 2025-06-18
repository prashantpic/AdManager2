import http from 'k6/http';
import { check } from 'k6';
import { ENV_CONFIG } from '../config/environments.js';

/**
 * Helper to get standard headers with Authorization token.
 * @param {string} authToken
 * @returns {object} Headers object.
 */
function getStandardHeaders(authToken) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
}

/**
 * Makes an HTTP GET request.
 * @param {string} urlPath - The path relative to the base API URL (e.g., '/campaigns').
 * @param {string} authToken - The bearer token for authorization.
 * @param {object} [params=null] - Optional k6 http request parameters (e.g., tags, specific headers).
 * @returns {object} The k6 response object.
 */
export function get(urlPath, authToken, params = null) {
    const url = `${ENV_CONFIG.API_BASE_URL}${urlPath}`;
    const requestParams = {
        headers: getStandardHeaders(authToken),
        ...params, // Allows overriding default headers or adding other k6 params like tags
    };
    if (params && params.headers) { // Merge explicitly passed headers
        requestParams.headers = { ...requestParams.headers, ...params.headers };
    }
    return http.get(url, requestParams);
}

/**
 * Makes an HTTP POST request.
 * @param {string} urlPath - The path relative to the base API URL.
 * @param {object|string} payload - The request body (will be JSON stringified if object).
 * @param {string} authToken - The bearer token for authorization.
 * @param {object} [params=null] - Optional k6 http request parameters.
 * @returns {object} The k6 response object.
 */
export function post(urlPath, payload, authToken, params = null) {
    const url = `${ENV_CONFIG.API_BASE_URL}${urlPath}`;
    const requestBody = typeof payload === 'object' ? JSON.stringify(payload) : payload;
    const requestParams = {
        headers: getStandardHeaders(authToken),
        ...params,
    };
    if (params && params.headers) {
        requestParams.headers = { ...requestParams.headers, ...params.headers };
    }
    return http.post(url, requestBody, requestParams);
}

/**
 * Makes an HTTP PUT request.
 * @param {string} urlPath - The path relative to the base API URL.
 * @param {object|string} payload - The request body.
 * @param {string} authToken - The bearer token for authorization.
 * @param {object} [params=null] - Optional k6 http request parameters.
 * @returns {object} The k6 response object.
 */
export function put(urlPath, payload, authToken, params = null) {
    const url = `${ENV_CONFIG.API_BASE_URL}${urlPath}`;
    const requestBody = typeof payload === 'object' ? JSON.stringify(payload) : payload;
    const requestParams = {
        headers: getStandardHeaders(authToken),
        ...params,
    };
    if (params && params.headers) {
        requestParams.headers = { ...requestParams.headers, ...params.headers };
    }
    return http.put(url, requestBody, requestParams);
}

/**
 * Makes an HTTP DELETE request.
 * @param {string} urlPath - The path relative to the base API URL.
 * @param {string} authToken - The bearer token for authorization.
 * @param {object} [params=null] - Optional k6 http request parameters.
 * @returns {object} The k6 response object.
 */
export function del(urlPath, authToken, params = null) {
    const url = `${ENV_CONFIG.API_BASE_URL}${urlPath}`;
    const requestParams = {
        headers: getStandardHeaders(authToken),
        ...params,
    };
    if (params && params.headers) {
        requestParams.headers = { ...requestParams.headers, ...params.headers };
    }
    // DELETE typically doesn't have a body, k6 `del` takes body as 2nd arg, params as 3rd
    return http.del(url, null, requestParams);
}


/**
 * Performs checks on an HTTP response.
 * @param {object} response - The k6 response object.
 * @param {number} expectedStatus - The expected HTTP status code.
 * @param {function} [customCheckFn=null] - Optional function for additional checks on the response object.
 *                                          It should take the response object and return true/false.
 * @returns {boolean} True if all checks pass, false otherwise.
 */
export function checkResponse(response, expectedStatus, customCheckFn = null) {
    const checks = {};
    checks[`status is ${expectedStatus}`] = (r) => r.status === expectedStatus;

    if (customCheckFn) {
        // Name the custom check something generic or allow it to be named.
        // For simplicity, using a generic name.
        checks['custom check passed'] = (r) => customCheckFn(r);
    }

    const success = check(response, checks);

    if (!success) {
        // Log details of failed checks
        console.error(`Response check failed for URL: ${response.request.url}`);
        console.error(`  Expected status: ${expectedStatus}, Actual status: ${response.status}`);
        if (response.status !== expectedStatus) {
            console.error(`  Response body for unexpected status: ${response.body}`);
        }
        if (customCheckFn) {
            const customCheckResult = customCheckFn(response);
            if (!customCheckResult) {
                console.error(`  Custom check function failed.`);
                 // console.error(`  Response body for failed custom check: ${response.body}`); // Optional: log body if custom check fails
            }
        }
    }
    return success;
}