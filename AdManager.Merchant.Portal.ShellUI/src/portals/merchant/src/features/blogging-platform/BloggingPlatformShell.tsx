import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import * as blogService from './services/blogService';
import { BlogPost, BlogPostData } from './blog.types';
import PostEditor from './components/PostEditor'; // Assuming PostEditor is created

/**
 * @file BloggingPlatformShell.tsx
 * @description Main UI component for the Blogging Platform feature.
 * It allows merchants to create, list, edit, and manage blog posts.
 * REQ-3395: Integrated blogging platform.
 * REQ-6-011: Usability and Accessibility.
 * REQ-6-012: Internationalization for tool UI.
 */

/**
 * BloggingPlatformShell component.
 * Provides the main interface for managing blog posts.
 * @returns {React.ReactElement} The BloggingPlatformShell component.
 */
const BloggingPlatformShell: React.FC = () => {
  const { t } = useTranslation(['shell', 'bloggingPlatform']);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); // To show/hide PostEditor

  const fetchBlogPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual pagination/filtering if needed by listBlogPosts
      const response = await blogService.listBlogPosts();
      setBlogPosts(response.data); // Assuming PaginatedResponse<BlogPost> has a 'data' field
    } catch (err: any) {
      setError(err.message || t('bloggingPlatform:errors.failedToFetchPosts'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!isEditing) { // Only fetch when not in editor mode or if editor closes
        fetchBlogPosts();
    }
  }, [fetchBlogPosts, isEditing]);

  const handleCreateNewPost = () => {
    setSelectedPost(null); // No existing post selected
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditing(true);
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm(t('bloggingPlatform:confirmations.deletePost'))) {
      setIsLoading(true);
      setError(null);
      try {
        await blogService.deleteBlogPost(id);
        fetchBlogPosts(); // Refresh list
      } catch (err: any) {
        setError(err.message || t('bloggingPlatform:errors.failedToDeletePost'));
        setIsLoading(false);
      }
      // setIsLoading is handled by fetchBlogPosts or set to false in catch
    }
  };
  
  const handleViewPublishedPost = (post: BlogPost) => {
    // This would typically open the published post URL in a new tab
    // The URL might be constructed using a base blog URL + post.seo.slug
    if (post.status === 'published' && post.seo.slug) {
      // Assuming a base URL structure, replace with actual logic
      const blogBaseUrl = '/blog/'; // Or from config
      window.open(`${blogBaseUrl}${post.seo.slug}`, '_blank');
    } else {
      alert(t('bloggingPlatform:alerts.postNotPublishedOrNoSlug'));
    }
  };

  const handleEditorClose = (refreshNeeded: boolean) => {
    setIsEditing(false);
    setSelectedPost(null);
    if (refreshNeeded) {
      fetchBlogPosts();
    }
  };


  if (isEditing) {
    return (
      <PostEditor
        post={selectedPost}
        onSaveSuccess={() => handleEditorClose(true)}
        onCancel={() => handleEditorClose(false)}
      />
    );
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        {t('bloggingPlatform:title')}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleCreateNewPost}
        sx={{ mb: 3 }}
        aria-label={t('bloggingPlatform:actions.createNewPost')}
      >
        {t('bloggingPlatform:actions.createNewPost')}
      </Button>

      {isLoading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isLoading && blogPosts.length === 0 && !error && (
        <Typography>{t('bloggingPlatform:noPostsFound')}</Typography>
      )}

      {!isLoading && blogPosts.length > 0 && (
        <List>
          {blogPosts.map((post) => (
            <React.Fragment key={post.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{display: 'flex', gap: 0.5}}>
                    {post.status === 'published' && (
                       <IconButton edge="end" aria-label={t('common.view')} onClick={() => handleViewPublishedPost(post)}>
                        <VisibilityIcon />
                      </IconButton>
                    )}
                    <IconButton edge="end" aria-label={t('common.edit')} onClick={() => handleEditPost(post)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label={t('common.delete')} onClick={() => handleDeletePost(post.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={post.title}
                  secondary={`${t('bloggingPlatform:postItem.status')}: ${t(`bloggingPlatform:statusValues.${post.status}`)} - ${t('bloggingPlatform:postItem.lastUpdated')}: ${new Date(post.updatedAt).toLocaleDateString()}`}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default BloggingPlatformShell;