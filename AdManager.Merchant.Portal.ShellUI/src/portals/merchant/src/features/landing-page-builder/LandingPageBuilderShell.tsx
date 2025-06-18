import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import * as landingPageService from './services/landingPageService';
import { LandingPage, LandingPageData, LandingPageElement } from './landingPage.types';
import { AppConfig } from '@/config/env'; // Assuming AppConfig is available for API endpoint examples if needed

/**
 * @file LandingPageBuilderShell.tsx
 * @description Main UI component for the Landing Page Builder feature.
 * It allows merchants to create, list, edit, and manage landing pages.
 * REQ-6-006: Tool to design and publish landing pages.
 * REQ-6-011: Usability and Accessibility.
 * REQ-6-012: Internationalization for tool UI.
 */

/**
 * Placeholder for a Draggable UI Element Palette item.
 * @interface DraggableElement
 */
interface DraggableElement {
  id: string;
  type: LandingPageElement['type'];
  label: string;
}

/**
 * LandingPageBuilderShell component.
 * Provides the main interface for managing and building landing pages.
 * @returns {React.ReactElement} The LandingPageBuilderShell component.
 */
const LandingPageBuilderShell: React.FC = () => {
  const { t } = useTranslation(['shell', 'landingPageBuilder']);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Placeholder for current page data being edited
  const [currentPageData, setCurrentPageData] = useState<Partial<LandingPageData>>({});
  // Placeholder for elements on the canvas
  const [canvasElements, setCanvasElements] = useState<LandingPageElement[]>([]);

  const fetchLandingPages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual pagination/filtering if needed by listLandingPages
      const response = await landingPageService.listLandingPages();
      setLandingPages(response.data); // Assuming PaginatedResponse<LandingPage> has a 'data' field
    } catch (err: any) {
      setError(err.message || t('landingPageBuilder:errors.failedToFetchPages'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchLandingPages();
  }, [fetchLandingPages]);

  const handleCreateNewPage = () => {
    setSelectedPage(null);
    setCurrentPageData({
      name: t('landingPageBuilder:newPage.defaultName'),
      elements: [],
      seo: { title: '', description: '', slug: '' },
      status: 'draft',
    });
    setCanvasElements([]);
    setIsEditing(true);
  };

  const handleEditPage = (page: LandingPage) => {
    setSelectedPage(page);
    setCurrentPageData({
      name: page.name,
      elements: page.elements,
      seo: page.seo,
      status: page.status,
    });
    setCanvasElements(page.elements);
    setIsEditing(true);
  };

  const handleDeletePage = async (id: string) => {
    if (window.confirm(t('landingPageBuilder:confirmations.deletePage'))) {
      setIsLoading(true);
      try {
        await landingPageService.deleteLandingPage(id);
        fetchLandingPages(); // Refresh list
      } catch (err: any) {
        setError(err.message || t('landingPageBuilder:errors.failedToDeletePage'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveDraft = async () => {
    if (!currentPageData.name) {
      setError(t('landingPageBuilder:errors.pageNameRequired'));
      return;
    }
    setIsLoading(true);
    setError(null);
    const dataToSave: LandingPageData = {
      name: currentPageData.name!,
      elements: canvasElements, // Use elements from canvas state
      seo: currentPageData.seo || { title: '', description: '', slug: '' },
      status: 'draft',
    };

    try {
      if (selectedPage?.id) {
        await landingPageService.updateLandingPage(selectedPage.id, dataToSave);
      } else {
        await landingPageService.createLandingPage(dataToSave);
      }
      fetchLandingPages();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || t('landingPageBuilder:errors.failedToSaveDraft'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishPage = async () => {
    if (!selectedPage?.id) {
      setError(t('landingPageBuilder:errors.selectPageToPublish'));
      return;
    }
    if (window.confirm(t('landingPageBuilder:confirmations.publishPage'))) {
      setIsLoading(true);
      setError(null);
      try {
        await landingPageService.publishLandingPage(selectedPage.id);
        fetchLandingPages(); // Refresh list to show updated status
        // Potentially update selectedPage state as well
      } catch (err: any) {
        setError(err.message || t('landingPageBuilder:errors.failedToPublishPage'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Placeholder for draggable elements
  const paletteElements: DraggableElement[] = [
    { id: 'text', type: 'text', label: t('landingPageBuilder:elements.text') },
    { id: 'image', type: 'image', label: t('landingPageBuilder:elements.image') },
    { id: 'button', type: 'button', label: t('landingPageBuilder:elements.button') },
    // Add more elements as per SDS (Video, Countdown Timer, Promotional Banner, CTA)
  ];

  // Placeholder functions for drag-and-drop and element property editing
  const handleElementDrop = (elementType: LandingPageElement['type']) => {
    console.log('Dropped element:', elementType);
    // Add new element to canvasElements state
    const newElement: LandingPageElement = {
      id: Date.now().toString(), // Temporary ID
      type: elementType,
      props: {}, // Default props
      styles: {}, // Default styles
    };
    setCanvasElements((prev) => [...prev, newElement]);
  };

  const handleElementConfigChange = (elementId: string, newProps: any) => {
    console.log('Configuring element:', elementId, newProps);
    // Update specific element in canvasElements state
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, props: { ...el.props, ...newProps } } : el)),
    );
  };


  if (isLoading && !isEditing) { // Show full page loader only when fetching list initially
    return <CircularProgress />;
  }

  if (error && !isEditing) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (isEditing) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          {selectedPage ? t('landingPageBuilder:editPageTitle') : t('landingPageBuilder:createPageTitle')}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={3}>
          {/* Column 1: Page Settings & Element Palette */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>{t('landingPageBuilder:pageSettings.title')}</Typography>
            <TextField
              label={t('landingPageBuilder:pageSettings.name')}
              fullWidth
              value={currentPageData.name || ''}
              onChange={(e) => setCurrentPageData({ ...currentPageData, name: e.target.value })}
              margin="normal"
              required
              aria-required="true"
            />
            <TextField
              label={t('landingPageBuilder:pageSettings.seoTitle')}
              fullWidth
              value={currentPageData.seo?.title || ''}
              onChange={(e) => setCurrentPageData({ ...currentPageData, seo: { ...currentPageData.seo!, title: e.target.value } })}
              margin="normal"
            />
            <TextField
              label={t('landingPageBuilder:pageSettings.seoDescription')}
              fullWidth
              multiline
              rows={3}
              value={currentPageData.seo?.description || ''}
              onChange={(e) => setCurrentPageData({ ...currentPageData, seo: { ...currentPageData.seo!, description: e.target.value } })}
              margin="normal"
            />
            <TextField
              label={t('landingPageBuilder:pageSettings.slug')}
              fullWidth
              value={currentPageData.seo?.slug || ''}
              onChange={(e) => setCurrentPageData({ ...currentPageData, seo: { ...currentPageData.seo!, slug: e.target.value } })}
              margin="normal"
              helperText={t('landingPageBuilder:pageSettings.slugHelper', {baseUrl: AppConfig.API_BASE_URL?.replace("/api","") || "your-domain.com"})}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t('landingPageBuilder:elements.paletteTitle')}</Typography>
            <List>
              {paletteElements.map((el) => (
                <ListItem key={el.id} 
                  sx={{ border: '1px solid #ddd', mb: 1, cursor: 'grab' }}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('elementType', el.type)} // Basic drag
                  onClick={() => handleElementDrop(el.type)} // Simple click to add for now
                >
                  <ListItemText primary={el.label} />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Column 2: Canvas Area */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>{t('landingPageBuilder:canvas.title')}</Typography>
            <Box
              sx={{
                minHeight: '400px',
                border: '1px dashed #ccc',
                p: 2,
                backgroundColor: '#f9f9f9',
                // Implement drag and drop receiving logic here
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  e.preventDefault();
                  const elementType = e.dataTransfer.getData('elementType') as LandingPageElement['type'];
                  if(elementType) handleElementDrop(elementType);
                }
              }}
              aria-label={t('landingPageBuilder:canvas.ariaLabel')}
            >
              {canvasElements.length === 0 && <Typography>{t('landingPageBuilder:canvas.empty')}</Typography>}
              {canvasElements.map((el) => (
                <Box key={el.id} sx={{ p: 1, border: '1px solid #eee', mb: 1, backgroundColor: 'white' }}>
                  <Typography variant="caption">{t('landingPageBuilder:elements.genericLabel', { type: el.type })}</Typography>
                  {/* Placeholder for element rendering and property editing trigger */}
                  <Button size="small" onClick={() => handleElementConfigChange(el.id, {text: 'New Text'})}>
                    {t('landingPageBuilder:canvas.configureElement')}
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={() => setIsEditing(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveDraft} disabled={isLoading}>
            {isLoading && selectedPage?.status !== 'published' ? <CircularProgress size={24} /> : t('landingPageBuilder:actions.saveDraft')}
          </Button>
          {selectedPage?.id && (
            <Button variant="contained" color="secondary" onClick={handlePublishPage} disabled={isLoading || selectedPage.status === 'published'}>
              {isLoading && selectedPage?.status === 'draft' ? <CircularProgress size={24} /> : t('landingPageBuilder:actions.publish')}
            </Button>
          )}
        </Box>
         {/* Placeholder for Properties Panel - This would typically be a more complex component */}
         <Box sx={{mt:2, p:2, border: '1px solid lightgrey'}}>
            <Typography variant="subtitle1">{t('landingPageBuilder:propertiesPanel.title')}</Typography>
            <Typography variant="body2">{t('landingPageBuilder:propertiesPanel.placeholder')}</Typography>
         </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t('landingPageBuilder:title')}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleCreateNewPage}
        sx={{ mb: 2 }}
        aria-label={t('landingPageBuilder:actions.createNewPage')}
      >
        {t('landingPageBuilder:actions.createNewPage')}
      </Button>

      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isLoading && landingPages.length === 0 && !error && (
        <Typography>{t('landingPageBuilder:noPagesFound')}</Typography>
      )}

      <List>
        {landingPages.map((page) => (
          <ListItem
            key={page.id}
            divider
            secondaryAction={
              <>
                <IconButton edge="end" aria-label={t('common.edit')} onClick={() => handleEditPage(page)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label={t('common.delete')} onClick={() => handleDeletePage(page.id)} sx={{ ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={page.name}
              secondary={`${t('landingPageBuilder:pageItem.status')}: ${page.status} - ${t('landingPageBuilder:pageItem.lastUpdated')}: ${new Date(page.updatedAt).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
       <Box sx={{mt: 2}}>
        <Typography variant="body2" color="textSecondary">
            {t('landingPageBuilder:noteApiUrl', { apiUrl: AppConfig.API_BASE_URL || 'N/A' })}
        </Typography>
       </Box>
    </Box>
  );
};

export default LandingPageBuilderShell;