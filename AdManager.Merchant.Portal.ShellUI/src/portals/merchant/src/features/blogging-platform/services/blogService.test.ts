import apiClient from '../../../core/services/apiClient';
import blogService from './blogService';
import { BlogPost, BlogPostData } from '../blog.types';
import { AppConfig } from '../../../config/env';

// Mock the apiClient
jest.mock('../../../core/services/apiClient');

const mockApiClientGet = apiClient.get as jest.Mock;
const mockApiClientPost = apiClient.post as jest.Mock;
const mockApiClientPut = apiClient.put as jest.Mock;
const mockApiClientDelete = apiClient.delete as jest.Mock;

const API_BASE_PATH = AppConfig.BLOG_POSTS_API_ENDPOINT || '/api/blog-posts';

describe('blogService', () => {
  const mockBlogPost: BlogPost = {
    id: 'post-123',
    merchantId: 'merchant-abc',
    title: 'Test Blog Post',
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }] },
    seo: { metaTitle: 'Test SEO Title', metaDescription: 'Test SEO Desc', slug: 'test-post' },
    status: 'draft',
    authorId: 'author-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockBlogPostData: BlogPostData = {
    title: 'New Blog Post',
    content: { type: 'doc', content: [] }, // Simplified content
    seo: { metaTitle: 'New SEO Title', metaDescription: 'New SEO Desc', slug: 'new-post' },
    status: 'draft',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBlogPost', () => {
    it('should call apiClient.post with correct endpoint and data, and return created blog post', async () => {
      mockApiClientPost.mockResolvedValue({ data: mockBlogPost });

      const result = await blogService.createBlogPost(mockBlogPostData);

      expect(mockApiClientPost).toHaveBeenCalledWith(API_BASE_PATH, mockBlogPostData);
      expect(result).toEqual(mockBlogPost);
    });
  });

  describe('getBlogPost', () => {
    it('should call apiClient.get with correct endpoint and return blog post data', async () => {
      mockApiClientGet.mockResolvedValue({ data: mockBlogPost });
      const id = 'post-123';

      const result = await blogService.getBlogPost(id);

      expect(mockApiClientGet).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}`);
      expect(result).toEqual(mockBlogPost);
    });
  });

  describe('updateBlogPost', () => {
    it('should call apiClient.put with correct endpoint and data, and return updated blog post', async () => {
      const id = 'post-123';
      const partialData: Partial<BlogPostData> = { title: 'Updated Title' };
      const updatedBlogPost = { ...mockBlogPost, ...partialData };
      mockApiClientPut.mockResolvedValue({ data: updatedBlogPost });

      const result = await blogService.updateBlogPost(id, partialData);

      expect(mockApiClientPut).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}`, partialData);
      expect(result).toEqual(updatedBlogPost);
    });
  });

  describe('publishBlogPost', () => {
    it('should call apiClient.post to publish endpoint and return blog post', async () => {
      const id = 'post-123';
      const publishedBlogPost = { ...mockBlogPost, status: 'published' as 'published' };
      mockApiClientPost.mockResolvedValue({ data: publishedBlogPost });

      const result = await blogService.publishBlogPost(id);

      expect(mockApiClientPost).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}/publish`);
      expect(result).toEqual(publishedBlogPost);
    });
  });

  describe('deleteBlogPost', () => {
    it('should call apiClient.delete with correct endpoint', async () => {
      const id = 'post-123';
      mockApiClientDelete.mockResolvedValue({}); // Simulate successful deletion

      await blogService.deleteBlogPost(id);

      expect(mockApiClientDelete).toHaveBeenCalledWith(`${API_BASE_PATH}/${id}`);
    });
  });

  describe('listBlogPosts', () => {
    it('should call apiClient.get with correct endpoint and params, and return paginated response', async () => {
      const mockPaginatedResponse = {
        items: [mockBlogPost],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      const params = { page: 1, limit: 10 };
      mockApiClientGet.mockResolvedValue({ data: mockPaginatedResponse });

      const result = await blogService.listBlogPosts(params);

      expect(mockApiClientGet).toHaveBeenCalledWith(API_BASE_PATH, { params });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should call apiClient.get with correct endpoint and no params if none provided', async () => {
        const mockPaginatedResponse = { items: [mockBlogPost], total: 1, page: 1, limit: 10, totalPages: 1 };
        mockApiClientGet.mockResolvedValue({ data: mockPaginatedResponse });
  
        const result = await blogService.listBlogPosts();
  
        expect(mockApiClientGet).toHaveBeenCalledWith(API_BASE_PATH, { params: undefined });
        expect(result).toEqual(mockPaginatedResponse);
      });
  });
});