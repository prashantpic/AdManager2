// cypress/utils/apiClient.ts

// This utility uses cy.request() and runs in the browser context as part of Cypress tests.
// It leverages Cypress.env for configuration.

const getApiBaseUrl = (): string => Cypress.env('API_BASE_URL') || 'http://localhost:8080/api/v1'; // Default from SDS

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body?: any;
  token?: string | null; // Explicitly allow null to override Cypress.env('authToken')
  headers?: { [key: string]: string };
  failOnStatusCode?: boolean;
  qs?: object; // For query string parameters
}

const makeRequest = (options: RequestOptions): Cypress.Chainable<Cypress.Response<any>> => {
  const requestUrl = `${getApiBaseUrl()}${options.url.startsWith('/') ? options.url : '/' + options.url}`;
  
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json', // Default, can be overridden by options.headers
    ...options.headers,
  };

  // Determine auth token: use explicitly passed token, then Cypress.env('authToken'), then null.
  const authToken = options.token !== undefined ? options.token : Cypress.env('authToken');

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return cy.request({
    method: options.method,
    url: requestUrl,
    body: options.body,
    headers: headers,
    failOnStatusCode: options.failOnStatusCode !== undefined ? options.failOnStatusCode : true,
    qs: options.qs,
  });
};

export const apiClient = {
  get: (url: string, token: string | null = null, headers?: { [key: string]: string }, qs?: object) =>
    makeRequest({ method: 'GET', url, token, headers, qs }),
  
  post: (url: string, body: any, token: string | null = null, headers?: { [key: string]: string }) =>
    makeRequest({ method: 'POST', url, body, token, headers }),
  
  put: (url: string, body: any, token: string | null = null, headers?: { [key: string]: string }) =>
    makeRequest({ method: 'PUT', url, body, token, headers }),
  
  delete: (url: string, token: string | null = null, headers?: { [key: string]: string }) =>
    makeRequest({ method: 'DELETE', url, token, headers }),
  
  patch: (url: string, body: any, token: string | null = null, headers?: { [key: string]: string }) =>
    makeRequest({ method: 'PATCH', url, body, token, headers }),
};