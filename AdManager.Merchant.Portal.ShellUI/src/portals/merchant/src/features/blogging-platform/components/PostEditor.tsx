import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as blogService from '../services/blogService';
import { BlogPost, BlogPostData, BlogPostSeo } from '../blog.types';

/**
 * @file PostEditor.tsx
 * @description Component for creating and editing blog posts, including rich text content and SEO settings.
 * REQ-3395: Integrated blogging platform (editor part).
 * REQ-6-011: Usability and Accessibility.
 */

/**
 * Props for the PostEditor component.
 * @interface PostEditorProps
 */
interface PostEditorProps {
  /**
   * The blog post to edit. If null, a new post is being created.
   * @type {BlogPost | null}
   */
  post: BlogPost | null;
  /**
   * Callback function invoked when the post is successfully saved (created or updated).
   * @type {() => void}
   */
  onSaveSuccess: () => void;
  /**
   * Callback function invoked when the editor is cancelled.
   * @type {() => void}
   */
  onCancel: () => void;
}

// Placeholder for available categories and tags (could be fetched or predefined)
const availableCategories = ['Technology', 'Marketing', 'E-commerce Tips', 'Product Updates'];
const availableTags = ['SEO', 'Content Marketing', 'Social Media', 'Case Study', 'Tutorial'];


/**
 * PostEditor component.
 * Provides a form for creating or editing blog posts, including a placeholder for a rich text editor.
 * @param {PostEditorProps} props - The props for the component.
 * @returns {React.ReactElement} The PostEditor component.
 */
const PostEditor: React.FC<PostEditorProps> = ({ post, onSaveSuccess, onCancel }) => {
  const { t } = useTranslation(['shell', 'bloggingPlatform', 'validation']);
  
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [content, setContent] = useState<any>(''); // JSON structure from rich text editor or HTML string
  const [excerpt, setExcerpt] = useState<string>('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const [metaTitle, setMetaTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>(''); // Comma-separated or array
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.seo?.slug || '');
      setContent(post.content || ''); // Initialize with post content
      setExcerpt(post.excerpt || '');
      setFeaturedImageUrl(post.featuredImageUrl || '');
      setMetaTitle(post.seo?.metaTitle || '');
      setMetaDescription(post.seo?.metaDescription || '');
      setKeywords(post.seo?.keywords?.join(', ') || '');
      setCategories(post.categories || []);
      setTags(post.tags || []);
    } else {
      // Reset form for new post
      setTitle('');
      setSlug('');
      setContent('');
      setExcerpt('');
      setFeaturedImageUrl('');
      setMetaTitle('');
      setMetaDescription('');
      setKeywords('');
      setCategories([]);
      setTags([]);
    }
  }, [post]);

  const handleSlugGeneration = (currentTitle: string) => {
    if(!post?.seo?.slug) { // Only auto-generate if slug is not already set (for existing posts) or if it's a new post.
        const newSlug = currentTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters (excluding spaces and hyphens)
        .replace(/\s+/g, '-')    // Replace spaces with hyphens
        .replace(/--+/g, '-');   // Replace multiple hyphens with single hyphen
      setSlug(newSlug);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    handleSlugGeneration(newTitle);
  };
  
  const handleCategoriesChange = (event: SelectChangeEvent<typeof categories>) => {
    const {
      target: { value },
    } = event;
    setCategories(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleTagsChange = (event: SelectChangeEvent<typeof tags>) => {
    const {
      target: { value },
    } = event;
    setTags(
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const handleSavePost = async (publish: boolean = false) => {
    if (!title.trim()) {
      setError(t('validation:required', { field: t('bloggingPlatform:postEditor.titleLabel') }));
      return;
    }
    if (!slug.trim()) {
        setError(t('validation:required', { field: t('bloggingPlatform:postEditor.slugLabel') }));
        return;
    }
    // Add more validation as needed

    setIsLoading(true);
    setError(null);

    const postData: BlogPostData = {
      title,
      content, // From rich text editor state
      excerpt,
      featuredImageUrl,
      status: publish ? 'published' : (post?.status === 'published' ? 'published' : 'draft'), // Keep published if already published, otherwise draft
      seo: {
        metaTitle: metaTitle || title, // Default to title if not set
        metaDescription,
        slug,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      },
      // authorId: needs to be sourced from auth context or similar
      publishDate: publish && (!post || post.status !== 'published') ? new Date().toISOString() : post?.publishDate,
      tags,
      categories,
    };

    try {
      let savedPost: BlogPost;
      if (post?.id) {
        savedPost = await blogService.updateBlogPost(post.id, postData);
        if (publish && post.status !== 'published') {
            await blogService.publishBlogPost(savedPost.id); // Separate publish call if state changes
        }
      } else {
        savedPost = await blogService.createBlogPost(postData);
        if (publish) {
            await blogService.publishBlogPost(savedPost.id);
        }
      }
      onSaveSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t('bloggingPlatform:errors.failedToSavePost'));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {post ? t('bloggingPlatform:postEditor.editTitle') : t('bloggingPlatform:postEditor.createTitle')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <TextField
            label={t('bloggingPlatform:postEditor.titleLabel')}
            fullWidth
            value={title}
            onChange={handleTitleChange}
            margin="normal"
            required
            aria-required="true"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />

          {/* Placeholder for Rich Text Editor */}
          <Box sx={{ my: 2, p: 2, border: '1px dashed #ccc', minHeight: '300px', backgroundColor: '#f9f9f9' }}
            aria-label={t('bloggingPlatform:postEditor.contentAreaLabel')}
            role="textbox" // Approximate role
            aria-multiline="true"
          >
            <Typography variant="subtitle1" gutterBottom>{t('bloggingPlatform:postEditor.richTextPlaceholderTitle')}</Typography>
            <Typography variant="body2">{t('bloggingPlatform:postEditor.richTextPlaceholderContent')}</Typography>
            <TextField
                label={t('bloggingPlatform:postEditor.contentLabel')}
                multiline
                rows={10}
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)} // Direct state update for plain text
                margin="normal"
                disabled={isLoading}
                InputLabelProps={{ shrink: true }}
                placeholder={t('bloggingPlatform:postEditor.contentPlaceholder')}
            />
          </Box>
          <TextField
            label={t('bloggingPlatform:postEditor.excerptLabel')}
            fullWidth
            multiline
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            margin="normal"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
            helperText={t('bloggingPlatform:postEditor.excerptHelper')}
          />
        </Grid>

        {/* Sidebar for SEO, Settings, etc. */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>{t('bloggingPlatform:postEditor.settingsTitle')}</Typography>
          <TextField
            label={t('bloggingPlatform:postEditor.slugLabel')}
            fullWidth
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            margin="normal"
            required
            aria-required="true"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
            helperText={t('bloggingPlatform:postEditor.slugHelper')}
          />
          <TextField
            label={t('bloggingPlatform:postEditor.featuredImageUrlLabel')}
            fullWidth
            value={featuredImageUrl}
            onChange={(e) => setFeaturedImageUrl(e.target.value)}
            margin="normal"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
            helperText={t('bloggingPlatform:postEditor.featuredImageUrlHelper')}
          />
          
          <FormControl fullWidth margin="normal" disabled={isLoading}>
            <InputLabel id="categories-label">{t('bloggingPlatform:postEditor.categoriesLabel')}</InputLabel>
            <Select
              labelId="categories-label"
              multiple
              value={categories}
              onChange={handleCategoriesChange}
              input={<OutlinedInput label={t('bloggingPlatform:postEditor.categoriesLabel')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {availableCategories.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={isLoading}>
            <InputLabel id="tags-label">{t('bloggingPlatform:postEditor.tagsLabel')}</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={tags}
              onChange={handleTagsChange}
              input={<OutlinedInput label={t('bloggingPlatform:postEditor.tagsLabel')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {availableTags.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('bloggingPlatform:postEditor.seoSettingsTitle')}</Typography>
          <TextField
            label={t('bloggingPlatform:postEditor.metaTitleLabel')}
            fullWidth
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            margin="normal"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
            helperText={t('bloggingPlatform:postEditor.metaTitleHelper')}
          />
          <TextField
            label={t('bloggingPlatform:postEditor.metaDescriptionLabel')}
            fullWidth
            multiline
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            margin="normal"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('bloggingPlatform:postEditor.keywordsLabel')}
            fullWidth
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            margin="normal"
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
            helperText={t('bloggingPlatform:postEditor.keywordsHelper')}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="text" onClick={onCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => handleSavePost(false)} 
            disabled={isLoading}
        >
          {isLoading && !publish ? <CircularProgress size={24} /> : t('bloggingPlatform:actions.saveDraft')}
        </Button>
        <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleSavePost(true)} 
            disabled={isLoading}
        >
          {isLoading && publish ? <CircularProgress size={24} /> : 
            (post?.status === 'published' ? t('bloggingPlatform:actions.updatePublished') : t('bloggingPlatform:actions.publish'))}
        </Button>
      </Box>
      
      {/* Placeholder for internal linking feature */}
      <Box sx={{ mt: 3, p: 2, border: '1px solid lightgrey', backgroundColor: '#fafafa' }}>
        <Typography variant="subtitle2" gutterBottom>{t('bloggingPlatform:postEditor.internalLinkingTitle')}</Typography>
        <Typography variant="body2">{t('bloggingPlatform:postEditor.internalLinkingPlaceholder')}</Typography>
      </Box>
      {/* Placeholder for Preview functionality */}
       <Box sx={{ mt: 1, textAlign: 'right' }}>
        <Button variant="text" disabled>{t('bloggingPlatform:actions.preview')}</Button>
      </Box>
    </Paper>
  );
};

export default PostEditor;