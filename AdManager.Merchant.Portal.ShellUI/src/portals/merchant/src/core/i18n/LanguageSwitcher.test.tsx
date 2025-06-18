import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'i18next'; // Your actual i18n instance or a mock
import LanguageSwitcher from './LanguageSwitcher';

// Mock i18next instance for testing
const mockI18n = {
  language: 'en',
  changeLanguage: jest.fn((lang: string) => {
    mockI18n.language = lang; // Simulate language change
    return Promise.resolve();
  }),
  isInitialized: true,
  t: (key: string, defaultValue?: string) => defaultValue || key, // Basic t function mock
  // Add other properties/methods if your component uses them
  options: {
    supportedLngs: ['en', 'ar'],
  },
  on: jest.fn(),
  off: jest.fn(),
  // Add any other methods/properties used by useTranslation or i18n instance
  services: {
    resourceStore: {
      data: {
        en: { shell: { 'languageSwitcher.label': 'Language', 'languageSwitcher.english': 'English', 'languageSwitcher.arabic': 'العربية' } },
        ar: { shell: { 'languageSwitcher.label': 'اللغة', 'languageSwitcher.english': 'English', 'languageSwitcher.arabic': 'العربية' } }
      }
    },
    // Mock other services if needed
    interpolator: {
        interpolate: (str: string) => str,
        nest: (str: string) => str,
    },
    languageUtils: {
        formatLanguageCode: (code: string) => code,
        isSupportedCode: (code: string) => ['en', 'ar'].includes(code),
    },
    pluralResolver: {
        getRule: () => ({ numbers: [1, 2] }), // Simplified mock
        needsPlural: () => false,
    },
    backendConnector: {},
    logger: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
    languageDetector: {},
    formatter: {},

  },
  resolvedLanguage: 'en',
  loadNamespaces: jest.fn(),
  getFixedT: jest.fn().mockImplementation((_lng, _ns) => (key: string, defaultValue?: string) => defaultValue || key),

};

// Mock useTranslation hook
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'), // Import and retain default behavior
  useTranslation: () => ({
    t: mockI18n.t,
    i18n: mockI18n,
  }),
}));


describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset mocks and document attributes before each test
    mockI18n.language = 'en';
    mockI18n.changeLanguage.mockClear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  const renderComponent = () =>
    render(
      <I18nextProvider i18n={mockI18n as any}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

  it('renders correctly with initial language (English)', () => {
    renderComponent();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    // Check if English is selected (value might be displayed or checked via select's value prop)
    // For MUI Select, we check the displayed value in the input
    expect(screen.getByRole('combobox')).toHaveTextContent('English');
  });

  it('changes language to Arabic when Arabic is selected', () => {
    renderComponent();
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select); // Open the select dropdown

    const arabicOption = screen.getByText('العربية');
    fireEvent.click(arabicOption);

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    // After language change, the component should re-render with the new language selected
    // Note: The visual update of the Select component itself might require waiting for MUI's internal state updates.
    // We are primarily testing the side effects (i18n call, document attributes).
  });

  it('changes language to English when English is selected (if current is Arabic)', () => {
    mockI18n.language = 'ar'; // Start with Arabic
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';

    renderComponent();
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    const englishOption = screen.getByText('English'); // MUI might show the translated label
    fireEvent.click(englishOption);

    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('displays correct labels from translations', () => {
    renderComponent();
    expect(screen.getByLabelText(mockI18n.t('shell:languageSwitcher.label', 'Language'))).toBeInTheDocument();
    // Open select to check menu item labels
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.getByText(mockI18n.t('shell:languageSwitcher.english', 'English'))).toBeInTheDocument();
    expect(screen.getByText(mockI18n.t('shell:languageSwitcher.arabic', 'العربية'))).toBeInTheDocument();
  });
});