import React, { useState, SyntheticEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import MainLayout from '@/core/layout/MainLayout';
import AuthGuard from '@/core/navigation/guards/AuthGuard';
import LandingPageBuilderShell from '@/features/landing-page-builder/LandingPageBuilderShell';
import BloggingPlatformShell from '@/features/blogging-platform/BloggingPlatformShell';
import WebIcon from '@mui/icons-material/Web'; // Example icon
import ArticleIcon from '@mui/icons-material/Article'; // Example icon


/**
 * @file ContentPage.tsx
 * @description Page component serving as an entry point for content creation tools
 * like the Landing Page Builder and Blogging Platform.
 * RequirementIds: REQ-6-006 (Landing Pages), REQ-3395 (Blogging Platform)
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * TabPanel component for displaying content of a specific tab.
 * @param {TabPanelProps} props - The props for the TabPanel.
 * @returns {React.ReactElement} The TabPanel component.
 */
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * Generates accessibility props for a tab.
 * @param {number} index - The index of the tab.
 * @returns {object} Accessibility props.
 */
function a11yProps(index: number) {
  return {
    id: `content-tab-${index}`,
    'aria-controls': `content-tabpanel-${index}`,
  };
}

/**
 * ContentPage component.
 * This page is protected by AuthGuard and uses MainLayout.
 * It uses MUI Tabs to switch between LandingPageBuilderShell and BloggingPlatformShell.
 * @returns {React.ReactElement} The ContentPage component.
 */
const ContentPage: NextPage = () => {
  const { t } = useTranslation(['shell', 'contentPage']); // 'contentPage' for specific titles if needed
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const pageTitles = [
    t('contentPage:landingPages.title', { defaultValue: "Landing Pages" }),
    t('contentPage:bloggingPlatform.title', { defaultValue: "Blogging Platform" }),
  ];

  return (
    <AuthGuard>
      <MainLayout>
        <Head>
          <title>{pageTitles[activeTab]} - {t('navigation.content', {defaultValue: "Content Hub"})} - AdManager</title>
        </Head>
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
          <Typography variant="h4" gutterBottom>
            {t('navigation.content', {defaultValue: "Content Hub"})}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab} 
              aria-label={t('contentPage:tabsAriaLabel', { defaultValue: "Content management sections"})}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                label={t('contentPage:landingPages.tabName', { defaultValue: "Landing Pages"})} 
                icon={<WebIcon />} 
                iconPosition="start"
                {...a11yProps(0)} 
              />
              <Tab 
                label={t('contentPage:bloggingPlatform.tabName', { defaultValue: "Blog Posts"})} 
                icon={<ArticleIcon />} 
                iconPosition="start"
                {...a11yProps(1)} 
              />
            </Tabs>
          </Box>
          <TabPanel value={activeTab} index={0}>
            <LandingPageBuilderShell />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <BloggingPlatformShell />
          </TabPanel>
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default ContentPage;