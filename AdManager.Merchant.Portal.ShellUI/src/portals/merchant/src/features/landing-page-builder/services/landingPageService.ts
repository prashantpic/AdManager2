import apiClient from '../../../core/services/apiClient';
import {
  LandingPage,
  LandingPageData,
  // Assuming ListParams and PaginatedResponse are defined elsewhere or simplified here
} from '../landingPage.types'; 
import { AppConfig } from '../../../config/env';

// Placeholder for generic list parameters and paginated response types
// These should ideally be defined in a shared types directory
interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any; // Allow other filter params
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_BASE_PATH = AppConfig.LANDING_PAGES_API_ENDPOINT || '/api/landing-pages';

/**
 * Service for interacting with the landing page backend API.
 * Provides methods for CRUD operations and publishing landing pages.
 */
const landingPageService = {
  /**
   * Creates a new landing page.
   * @param {LandingPageData} data - The data for the new landing page.
   * @returns {Promise<LandingPage>} A promise that resolves to the created landing page.
   * @see {@link REQ-6-006}
   */
  async createLandingPage(data: LandingPageData): Promise<LandingPage> {
    const response = await apiClient.post<LandingPage>(API_BASE_PATH, data);
    return response.data;
  },

  /**
   * Retrieves a specific landing page by its ID.
   * @param {string} id - The ID of the landing page to retrieve.
   * @returns {Promise<LandingPage>} A promise that resolves to the landing page data.
   * @see {@link REQ-6-006}
   */
  async getLandingPage(id: string): Promise<LandingPage> {
    const response = await apiClient.get<LandingPage>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Updates an existing landing page.
   * @param {string} id - The ID of the landing page to update.
   * @param {Partial<LandingPageData>} data - The partial data to update the landing page with.
   * @returns {Promise<LandingPage>} A promise that resolves to the updated landing page.
   * @see {@link REQ-6-006}
   */
  async updateLandingPage(id: string, data: Partial<LandingPageData>): Promise<LandingPage> {
    const response = await apiClient.put<LandingPage>(`${API_BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Publishes a landing page.
   * @param {string} id - The ID of the landing page to publish.
   * @returns {Promise<LandingPage>} A promise that resolves to the published landing page (often includes updated status).
   * @see {@link REQ-6-006}
   */
  async publishLandingPage(id: string): Promise<LandingPage> {
    const response = await apiClient.post<LandingPage>(`${API_BASE_PATH}/${id}/publish`);
    return response.data;
  },

  /**
   * Deletes a landing page.
   * @param {string} id - The ID of the landing page to delete.
   * @returns {Promise<void>} A promise that resolves when the landing page is successfully deleted.
   * @see {@link REQ-6-006}
   */
  async deleteLandingPage(id: string): Promise<void> {
    await apiClient.delete(`${API_BASE_PATH}/${id}`);
  },

  /**
   * Lists all landing pages, with optional pagination and filtering.
   * @param {ListParams} [params] - Optional parameters for pagination and filtering.
   * @returns {Promise<PaginatedResponse<LandingPage>>} A promise that resolves to a paginated list of landing pages.
   * @see {@link REQ-6-006}
   */
  async listLandingPages(params?: ListParams): Promise<PaginatedResponse<LandingPage>> {
    const response = await apiClient.get<PaginatedResponse<LandingPage>>(API_BASE_PATH, { params });
    return response.data;
  },
};

export default landingPageService;