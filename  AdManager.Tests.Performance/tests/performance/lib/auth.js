import http from 'k6/http';
import { check } from 'k6';
import { ENV_CONFIG } from '../config/environments.js';

/**
 * Handles authentication and retrieves an access token.
 * @param {string} username
 * @param {string} password
 * @returns {string} The access token.
 * @throws {Error} If authentication fails.
 */
export function getAuthToken(username, password) {
    const authUrl = ENV_CONFIG.AUTH_URL;

    // Adjust payload and headers based on actual auth service requirements
    // SDS Example: OAuth2 password grant
    const payload = {
        username: username,
        password: password,
        grant_type: 'password', // Example for OAuth2 password grant
    };

    // k6 http.post for application/x-www-form-urlencoded expects an object as payload
    // If it's application/json, it should be JSON.stringify(payload)
    // Assuming form-urlencoded based on typical OAuth2 password grant
    const params = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    console.log(`Attempting authentication against: ${authUrl} for user: ${username}`);
    const res = http.post(authUrl, payload, params);

    const authSuccess = check(res, {
        'Authentication successful (status 2xx)': (r) => r.status >= 200 && r.status < 300,
        'Response contains access_token': (r) => {
            try {
                const body = r.json(); // k6 provides r.json() to parse JSON response
                return body && typeof body.access_token === 'string' && body.access_token.length > 0;
            } catch (e) {
                return false;
            }
        },
    });

    if (!authSuccess) {
        console.error(`Authentication failed. Status: ${res.status}, Body: ${res.body}`);
        throw new Error(`Authentication failed. Status: ${res.status}. See console for details.`);
    }
    
    try {
        const responseBody = res.json();
        console.log("Authentication successful.");
        return responseBody.access_token;
    } catch (e) {
        // This case should ideally be caught by the check if access_token is missing,
        // but explicit try-catch for parsing is safer.
        console.error(`Failed to parse authentication response JSON or access_token missing. Body: ${res.body}. Error: ${e}`);
        throw new Error("Failed to parse authentication response or access_token missing.");
    }
}