// cypress/tasks/apiTasks.ts
import supertest from 'supertest';

// API_BASE_URL should ideally come from config passed to tasks or env var
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1'; // Default from SDS
const request = supertest(API_BASE_URL);

export interface ApiCallOptions {
  endpoint: string;
  payload?: object;
  authToken?: string;
  entityId?: string;
}

export const createEntityViaApi = async ({ endpoint, payload, authToken }: ApiCallOptions): Promise<object> => {
  console.log(`[API Task] Creating entity at ${API_BASE_URL}${endpoint}`);
  let req = request.post(endpoint).send(payload);
  if (authToken) {
    req = req.set('Authorization', `Bearer ${authToken}`);
  }
  req.set('Content-Type', 'application/json'); // Ensure content type
  
  try {
    const response = await req;
    if (response.status >= 400) {
      console.error(`[API Task] Error creating entity at ${endpoint}. Status: ${response.status}, Body:`, response.body);
      throw new Error(`API Error creating entity (${response.status}): ${JSON.stringify(response.body)}`);
    }
    console.log(`[API Task] Successfully created entity at ${endpoint}. Status: ${response.status}`);
    return response.body;
  } catch (error) {
    console.error(`[API Task] Exception during createEntityViaApi for ${endpoint}:`, error);
    throw error; // Re-throw to fail the Cypress task
  }
};

export const deleteEntityViaApi = async ({ endpoint, entityId, authToken }: ApiCallOptions): Promise<object | null> => {
  const targetUrl = `${endpoint}/${entityId}`;
  console.log(`[API Task] Deleting entity ${entityId} at ${API_BASE_URL}${targetUrl}`);
  let req = request.delete(targetUrl);
  if (authToken) {
    req = req.set('Authorization', `Bearer ${authToken}`);
  }

  try {
    const response = await req;
    if (response.status === 404) {
      console.log(`[API Task] Entity ${entityId} not found at ${targetUrl} (already deleted or never existed). Status: 404`);
      return null; // Gracefully handle 404
    }
    if (response.status >= 400) {
      console.error(`[API Task] Error deleting entity ${entityId} at ${targetUrl}. Status: ${response.status}, Body:`, response.body);
      throw new Error(`API Error deleting entity (${response.status}): ${JSON.stringify(response.body)}`);
    }
    console.log(`[API Task] Successfully deleted entity ${entityId} at ${targetUrl}. Status: ${response.status}`);
    return response.body;
  } catch (error) {
    console.error(`[API Task] Exception during deleteEntityViaApi for ${targetUrl}:`, error);
    throw error;
  }
};

export const getEntityViaApi = async ({ endpoint, entityId, authToken }: ApiCallOptions): Promise<object | null> => {
    const targetUrl = `${endpoint}/${entityId}`;
    console.log(`[API Task] Getting entity ${entityId} from ${API_BASE_URL}${targetUrl}`);
    let req = request.get(targetUrl);
    if (authToken) {
        req = req.set('Authorization', `Bearer ${authToken}`);
    }

    try {
        const response = await req;
        if (response.status === 404) {
            console.log(`[API Task] Entity ${entityId} not found at ${targetUrl}. Status: 404`);
            return null; // Gracefully handle 404
        }
        if (response.status >= 400) {
            console.error(`[API Task] Error getting entity ${entityId} from ${targetUrl}. Status: ${response.status}, Body:`, response.body);
            throw new Error(`API Error getting entity (${response.status}): ${JSON.stringify(response.body)}`);
        }
        console.log(`[API Task] Successfully retrieved entity ${entityId} from ${targetUrl}. Status: ${response.status}`);
        return response.body;
    } catch (error) {
        console.error(`[API Task] Exception during getEntityViaApi for ${targetUrl}:`, error);
        throw error;
    }
};

// Define expected response structure for login if known, e.g., { access_token: string; ... }
interface LoginResponse {
    access_token: string;
    // Add other expected properties from the login response
    [key: string]: any; 
}

export const performApiLogin = async (userCredentials: { username: string, password: string }): Promise<LoginResponse> => {
    const authEndpoint = '/auth/login'; // Adjust to your actual auth endpoint
    console.log(`[API Task] Logging in user ${userCredentials.username} at ${API_BASE_URL}${authEndpoint}`);
    
    try {
        const response = await request
            .post(authEndpoint) 
            .send(userCredentials)
            .set('Content-Type', 'application/json');

        if (response.status >= 400) {
            console.error(`[API Task] Login failed for user ${userCredentials.username}. Status: ${response.status}, Body:`, response.body);
            throw new Error(`API Login Error (${response.status}): ${JSON.stringify(response.body)}`);
        }
        if (!response.body || !response.body.access_token) {
            console.error(`[API Task] Login response for user ${userCredentials.username} did not include an access_token. Body:`, response.body);
            throw new Error('API Login Error: access_token missing in response.');
        }
        console.log(`[API Task] Login successful for user ${userCredentials.username}, token obtained.`);
        return response.body as LoginResponse; // Assuming body contains { access_token: '...' }
    } catch (error) {
        console.error(`[API Task] Exception during performApiLogin for user ${userCredentials.username}:`, error);
        throw error;
    }
};

// Add other API tasks as needed, for example:
// export const updateEntityViaApi = async ({ endpoint, entityId, payload, authToken }: ApiCallOptions): Promise<object> => { ... }