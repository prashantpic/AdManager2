import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AppConfig } from '../../config/env'; // Assuming AppConfig is exported from env.ts
// import { notificationService } from './notificationService'; // Assuming notificationService exists
// import { store } from '../state/store'; // To dispatch logout or refresh actions
// import { authActions } from '../auth/authSlice'; // Example: if auth state is in Redux

/**
 * @file Centralized Axios instance setup for making API calls.
 * @summary Configured Axios instance for making HTTP requests to backend APIs.
 * Includes interceptors for adding auth tokens and handling global API errors.
 */

/**
 * Creates an Axios instance with pre-configured settings.
 * The `baseURL` is taken from the application's environment configuration.
 *
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: AppConfig.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // Optional: default timeout for requests
});

/**
 * Request interceptor.
 * This function is called before each request is sent.
 * It's used here to add the JWT authorization token to the request headers if available.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve token from localStorage (or another secure client-side storage)
    // This assumes the token is stored client-side after login.
    // For Next.js, localStorage is only available on the client.
    // If API calls are made server-side, token handling will differ.
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken'); // Ensure key matches where token is stored
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request error (e.g., network error before request is sent)
    // console.error('API Request Error:', error);
    // notificationService.showError('A network error occurred. Please try again.');
    return Promise.reject(error);
  }
);

/**
 * Response interceptor.
 * This function is called after a response is received.
 * It's used here to handle global API errors (e.g., 401, 403, 5xx).
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // You can transform response data here if needed
    return response; // response.data is often what's needed
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const errorMessage = (data as { message?: string })?.message || error.message;

      switch (status) {
        case 401:
          // Unauthorized: Token might be invalid or expired.
          // Trigger logout or token refresh mechanism.
          // console.error('API Error 401: Unauthorized', errorMessage);
          // notificationService.showError('Session expired. Please login again.');
          // Example: store.dispatch(authActions.logout());
          // Or redirect to login page:
          // if (typeof window !== 'undefined') {
          //   window.location.href = '/login'; // Or use Next.js router if available here
          // }
          break;
        case 403:
          // Forbidden: User does not have permission for the resource.
          // console.error('API Error 403: Forbidden', errorMessage);
          // notificationService.showError('You do not have permission to perform this action.');
          break;
        case 400:
        case 404:
        case 422:
           // Specific client errors
          // console.error(`API Error ${status}:`, errorMessage, data);
          // notificationService.showError(errorMessage || `Request failed with status ${status}.`);
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          // console.error(`API Error ${status}: Server Error`, errorMessage);
          // notificationService.showError('A server error occurred. Please try again later.');
          break;
        default:
          // Handle other errors
          // console.error(`API Error ${status}:`, errorMessage);
          // notificationService.showError(errorMessage || 'An unexpected error occurred.');
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.error('API Error: No response received', error.request);
      // notificationService.showError('No response from server. Check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.error('API Error: Request setup error', error.message);
      // notificationService.showError('Error setting up request: ' + error.message);
    }

    // It's important to return a Promise.reject to propagate the error
    // so that individual service calls can also handle it if needed.
    return Promise.reject(error);
  }
);

export default apiClient;