import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // For internal navigation if needed

/**
 * `Footer` component for the application.
 * It displays copyright information and links to static pages like
 * "Terms of Service" and "Privacy Policy".
 *
 * @returns {React.ReactElement} The application footer.
 * @see {@link REQ-6-011} - Accessibility: Ensure links are clear and content is readable.
 */
const Footer: React.FC = () => {
  const { t } = useTranslation(['shell', 'common']);
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto', // Pushes footer to the bottom if content is short
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {t('footer.copyright', { year: currentYear, appName: t('common:appName', 'Ad Manager Platform') }, `© ${currentYear} ${t('common:appName', 'Ad Manager Platform')}. All rights reserved.`)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link href="/terms-of-service" passHref legacyBehavior>
              <MuiLink variant="body2" color="text.secondary" underline="hover">
                {t('footer.termsOfService', 'Terms of Service')}
              </MuiLink>
            </Link>
            <Link href="/privacy-policy" passHref legacyBehavior>
              <MuiLink variant="body2" color="text.secondary" underline="hover">
                {t('footer.privacyPolicy', 'Privacy Policy')}
              </MuiLink>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;