import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';

/**
 * `LanguageSwitcher` component allows users to change the application's language.
 * It uses `react-i18next` for internationalization and updates the `lang` and `dir`
 * attributes on the HTML document root for proper RTL handling and accessibility.
 *
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 * @returns {React.ReactElement} A MUI Select component for language selection.
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language.split('-')[0]; // Get base language e.g. 'en' from 'en-US'

  /**
   * Handles the language change event.
   * It calls `i18n.changeLanguage` to switch the language and updates
   * the document's `lang` and `dir` attributes.
   * @param {SelectChangeEvent<string>} event - The event object from the MUI Select component.
   */
  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="language-switcher-label" sx={{color: 'inherit'}}>
        {t('shell:languageSwitcher.label', 'Language')}
      </InputLabel>
      <Select
        labelId="language-switcher-label"
        id="language-switcher-select"
        value={currentLanguage}
        label={t('shell:languageSwitcher.label', 'Language')}
        onChange={handleLanguageChange}
        variant="outlined"
        sx={{
            color: 'inherit',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)', // Adjust border color for visibility on dark backgrounds
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
            },
            '& .MuiSvgIcon-root': {
                color: 'inherit',
            },
        }}
      >
        <MenuItem value="en">{t('shell:languageSwitcher.english', 'English')}</MenuItem>
        <MenuItem value="ar">{t('shell:languageSwitcher.arabic', 'العربية')}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;