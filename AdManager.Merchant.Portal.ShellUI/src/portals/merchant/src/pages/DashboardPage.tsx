import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/core/layout/MainLayout';
import AuthGuard from '@/core/navigation/guards/AuthGuard';
import AnalyticsDashboardModuleLoader from '@/features/module-integrations/AnalyticsDashboardModuleLoader'; // Placeholder import
import { Typography, Box } from '@mui/material';

/**
 * @file DashboardPage.tsx
 * @description The main dashboard page for merchants. It primarily acts as a container
 * for the AnalyticsDashboardModuleLoader and may include other shell-specific information.
 * RequirementId: 3.3.1 (User Interface - merchant-facing Ad Manager dashboard)
 */

/**
 * DashboardPage component.
 * This page is protected by AuthGuard and uses the MainLayout.
 * It sets the page title and renders the AnalyticsDashboardModuleLoader.
 * @returns {React.ReactElement} The DashboardPage component.
 */
const DashboardPage: NextPage = () => {
  const { t } = useTranslation('shell'); // Assuming 'shell' namespace has 'dashboard.title'

  return (
    <AuthGuard>
      <MainLayout>
        <Head>
          <title>{t('navigation.dashboard', {defaultValue: "Dashboard"})} - AdManager</title>
        </Head>
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Typography variant="h4" gutterBottom>
            {t('navigation.dashboard', {defaultValue: "Dashboard"})}
          </Typography>
          
          {/* Shell-specific welcome message or quick links can go here */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              {t('dashboard.welcomeMessage', {defaultValue: "Welcome to your Ad Manager Dashboard."})}
            </Typography>
            {/* Example of quick links (placeholders) */}
            {/* 
            <Box sx={{mt: 2}}>
                <Button component={NextLink} href="/campaigns" variant="outlined" sx={{mr: 1}}>
                    {t('dashboard.quickLinks.manageCampaigns', {defaultValue: "Manage Campaigns"})}
                </Button>
                <Button component={NextLink} href="/content" variant="outlined">
                    {t('dashboard.quickLinks.manageContent', {defaultValue: "Manage Content"})}
                </Button>
            </Box>
            */}
          </Box>

          {/* Load the actual analytics dashboard UI module */}
          <AnalyticsDashboardModuleLoader />
        </Box>
      </MainLayout>
    </AuthGuard>
  );
};

export default DashboardPage;