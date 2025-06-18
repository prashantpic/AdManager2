import apiClient from '../../../core/services/apiClient';
import {
  BlogPost,
  BlogPostData,
  // Assuming ListParams and PaginatedResponse are defined elsewhere or simplified here
} from '../blog.types';
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


const API_BASE_PATH = AppConfig.BLOG_POSTS_API_ENDPOINT || '/api/blog-posts';

/**
 * Service for interacting with the blog post backend API.
 * Provides methods for CRUD operations, publishing, and listing blog posts.
 */
const blogService = {
  /**
   * Creates a new blog post.
   * @param {BlogPostData} data - The data for the new blog post.
   * @returns {Promise<BlogPost>} A promise that resolves to the created blog post.
   * @see {@link REQ-3395}
   */
  async createBlogPost(data: BlogPostData): Promise<BlogPost> {
    const response = await apiClient.post<BlogPost>(API_BASE_PATH, data);
    return response.data;
  },

  /**
   * Retrieves a specific blog post by its ID.
   * @param {string} id - The ID of the blog post to retrieve.
   * @returns {Promise<BlogPost>} A promise that resolves to the blog post data.
   * @see {@link REQ-3395}
   */
  async getBlogPost(id: string): Promise<BlogPost> {
    const response = await apiClient.get<BlogPost>(`${API_BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Updates an existing blog post.
   * @param {string} id - The ID of the blog post to update.
   * @param {Partial<BlogPostData>} data - The partial data to update the blog post with.
   * @returns {Promise<BlogPost>} A promise that resolves to the updated blog post.
   * @see {@link REQ-3395}
   */
  async updateBlogPost(id: string, data: Partial<BlogPostData>): Promise<BlogPost> {
    const response = await apiClient.put<BlogPost>(`${API_BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Publishes a blog post.
   * @param {string} id - The ID of the blog post to publish.
   * @returns {Promise<BlogPost>} A promise that resolves to the published blog post (often includes updated status).
   * @see {@link REQ-3395}
   */
  async publishBlogPost(id: string): Promise<BlogPost> {
    const response = await apiClient.post<BlogPost>(`${API_BASE_PATH}/${id}/publish`);
    return response.data;
  },

  /**
   * Deletes a blog post.
   * @param {string} id - The ID of the blog post to delete.
   * @returns {Promise<void>} A promise that resolves when the blog post is successfully deleted.
   * @see {@link REQ-3395}
   */
  async deleteBlogPost(id: string): Promise<void> {
    await apiClient.delete(`${API_BASE_PATH}/${id}`);
  },

  /**
   * Lists all blog posts, with optional pagination and filtering.
   * @param {ListParams} [params] - Optional parameters for pagination and filtering.
   * @returns {Promise<PaginatedResponse<BlogPost>>} A promise that resolves to a paginated list of blog posts.
   * @see {@link REQ-3395}
   */
  async listBlogPosts(params?: ListParams): Promise<PaginatedResponse<BlogPost>> {
    const response = await apiClient.get<PaginatedResponse<BlogPost>>(API_BASE_PATH, { params });
    return response.data;
  },
};

export default blogService;