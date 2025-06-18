import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next'; // Your actual i18n instance or a mock
import Footer from './Footer';

// Mock i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string, options?: any, defaultValue?: string) => {
        if (key === 'footer.copyright') {
            return `© ${options.year} ${options.appName}. All rights reserved.`;
        }
        return defaultValue || key.split('.').pop() || key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock Next.js Link
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);

const theme = createTheme();

describe('Footer', () => {
  const currentYear = new Date().getFullYear();

  const renderFooter = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <Footer />
        </ThemeProvider>
      </I18nextProvider>
    );
  };

  it('renders copyright information with the current year and app name', () => {
    renderFooter();
    // The t mock for footer.copyright includes dynamic parts.
    // We expect the text to contain the current year and the default app name.
    const expectedCopyrightText = `© ${currentYear} Ad Manager Platform. All rights reserved.`;
    expect(screen.getByText(expectedCopyrightText, { exact: false })).toBeInTheDocument();
  });

  it('renders link to Terms of Service', () => {
    renderFooter();
    const termsLink = screen.getByText('Terms of Service');
    expect(termsLink).toBeInTheDocument();
    expect(termsLink.closest('a')).toHaveAttribute('href', '/terms-of-service');
  });

  it('renders link to Privacy Policy', () => {
    renderFooter();
    const privacyLink = screen.getByText('Privacy Policy');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy-policy');
  });

  it('uses translations for link texts (conceptual)', () => {
    // This is implicitly tested by checking the default values if t mock returns them
    // For a more direct test, you'd need a more complex t mock or to check the key passed to t
    renderFooter();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument(); // Assumes t('footer.termsOfService', 'Terms of Service')
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument(); // Assumes t('footer.privacyPolicy', 'Privacy Policy')
  });
});