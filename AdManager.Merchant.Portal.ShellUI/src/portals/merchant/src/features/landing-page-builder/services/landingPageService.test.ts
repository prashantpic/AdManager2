import apiClient from '../../../core/services/apiClient';
import landingPageService from './landingPageService';
import { LandingPage, LandingPageData } from '../landingPage.types';
import { AppConfig } from '../../../config/env';

// Mock the apiClient
jest.mock('../../../core/services/apiClient');

const mockApiClientGet = apiClient.get as jest.Mock;
const mockApiClientPost = apiClient.post as jest.Mock;
const mockApiClientPut = apiClient.put as jest.Mock;
const mockApiClientDelete = apiClient.delete as jest.Mock;

const API_BASE_PATH = AppConfig.LANDING_PAGES_API_ENDPOINT || '/api/landing-pages';

describe('landingPageService', () => {
  const mockLandingPage: LandingPage = {
    id: 'lp-123',
    merchantId: 'merchant-abc',
    name: 'Test Landing Page',
    elements: [],
    seo: { title: 'Test SEO Title', description: 'Test SEO Desc', slug: 'test-lp' },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockLandingPageData: LandingPageData = {
    name: 'New Landing Page',
    elements: [{ id: 'el1', type: 'text', props: { content: 'Hello' }, styles: {} }],
    seo: { title: 'New SEO Title', description: 'New SEO Desc', slug: 'new-lp' },
    status: 'draft',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLandingPage', () => {
    it('should call apiClient.post with correct endpoint and data, and return created landing page', async () => {
      mockApiClientPost.mockResolvedValue({ data: mockLandingPage });

      const result = await landingPageService.createLandingPage(mockLandingPageData);

      expect(mockApiClientPost).toHaveBeenCalledWith(API_BASE_PATH, mockLandingPageData);
      expect(result).toEqual(mockLandingPage);
    });
  });

  describe('getLandingPage', () => {
    it('should call apiClient.get with correct endpoint and return landing page data', async () => {
      mockApiClientGet.mockResolvedValue({ data: mockLandingPage });
      const id = 'lp-123';

      const result = await landingPageService.getLandingPage(id);

      expect(mockApiClientGet).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}`);
      expect(result).toEqual(mockLandingPage);
    });
  });

  describe('updateLandingPage', () => {
    it('should call apiClient.put with correct endpoint and data, and return updated landing page', async () => {
      const id = 'lp-123';
      const partialData: Partial<LandingPageData> = { name: 'Updated Name' };
      const updatedLandingPage = { ...mockLandingPage, ...partialData };
      mockApiClientPut.mockResolvedValue({ data: updatedLandingPage });

      const result = await landingPageService.updateLandingPage(id, partialData);

      expect(mockApiClientPut).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}`, partialData);
      expect(result).toEqual(updatedLandingPage);
    });
  });

  describe('publishLandingPage', () => {
    it('should call apiClient.post to publish endpoint and return landing page', async () => {
      const id = 'lp-123';
      const publishedLandingPage = { ...mockLandingPage, status: 'published' as 'published' };
      mockApiClientPost.mockResolvedValue({ data: publishedLandingPage });

      const result = await landingPageService.publishLandingPage(id);

      expect(mockApiClientPost).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}/publish`);
      expect(result).toEqual(publishedLandingPage);
    });
  });

  describe('deleteLandingPage', () => {
    it('should call apiClient.delete with correct endpoint', async () => {
      const id = 'lp-123';
      mockApiClientDelete.mockResolvedValue({}); // Simulate successful deletion

      await landingPageService.deleteLandingPage(id);

      expect(mockApiClientDelete).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}`);
    });
  });

  describe('listLandingPages', () => {
    it('should call apiClient.get with correct endpoint and params, and return paginated response', async () => {
      const mockPaginatedResponse = {
        items: [mockLandingPage],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      const params = { page: 1, limit: 10 };
      mockApiClientGet.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await landingPageService.listLandingPages(params);

      expect(mockApiClientGet).toHaveBeenCalledWith(API_BASE_PATH, { params });
      expect(result).toEqual(mockPaginatedResponse);
    });

     it('should call apiClient.get with correct endpoint and no params if none provided', async () => {
      const mockPaginatedResponse = { items: [mockLandingPage], total: 1, page: 1, limit: 10, totalPages: 1 };
      mockApiClientGet.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await landingPageService.listLandingPages();

      expect(mockApiClientGet).toHaveBeenCalledWith(API_BASE_PATH, { params: undefined });
      expect(result).toEqual(mockPaginatedResponse);
    });
  });
});