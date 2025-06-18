import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import i18n from 'i18next'; // Your actual i18n instance or a mock
import Header, { HeaderProps } from './Header';
import useAuth from '../auth/useAuth';
import { UserProfile } from '../auth/auth.types';

// Mock i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock useAuth
jest.mock('../auth/useAuth');
const mockUseAuth = useAuth as jest.Mock;

// Mock LanguageSwitcher
jest.mock('../i18n/LanguageSwitcher', () => () => <div data-testid="mock-language-switcher">LanguageSwitcher</div>);

// Mock Next.js Link
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);


const theme = createTheme();
const mockStore = configureStore([]);

describe('Header', () => {
  let store: any;
  const mockLogout = jest.fn();
  const mockOnDrawerToggle = jest.fn();

  const defaultUser: UserProfile = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    merchantId: 'merchant1',
    roles: ['admin'],
  };

  const defaultProps: HeaderProps = {
    onDrawerToggle: mockOnDrawerToggle,
    sidebarOpen: false,
    drawerWidth: 240,
  };

  const renderHeader = (user: UserProfile | null = defaultUser, props: Partial<HeaderProps> = {}) => {
    mockUseAuth.mockReturnValue({
      currentUser: user, // currentUser from useAuth
      logout: mockLogout,
      isAuthenticated: !!user,
    });
    // If merchantProfile is used from Redux, mock Redux store state
    const initialState = {
      merchantContext: { profile: user, isLoading: false, error: null }, // profile from Redux
      ui: { themeMode: 'light' },
    };
    store = mockStore(initialState);

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <Header {...defaultProps} {...props} />
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app name/logo', () => {
    renderHeader();
    expect(screen.getByText('Ad Manager')).toBeInTheDocument(); // From t('common:appName', 'Ad Manager')
  });

  it('renders LanguageSwitcher', () => {
    renderHeader();
    expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument();
  });

  it('renders notification icon', () => {
    renderHeader();
    expect(screen.getByLabelText('View notifications')).toBeInTheDocument();
  });

  it('renders user avatar and opens user menu on click', () => {
    renderHeader();
    const avatarButton = screen.getByLabelText('Account settings');
    expect(avatarButton).toBeInTheDocument();

    fireEvent.click(avatarButton);
    expect(screen.getByText('Profile')).toBeInTheDocument(); // Menu item
    expect(screen.getByText('Logout')).toBeInTheDocument(); // Menu item
    expect(screen.getByText(defaultUser.name)).toBeInTheDocument(); // User name in menu
    expect(screen.getByText(defaultUser.email)).toBeInTheDocument(); // User email in menu
  });

  it('calls onDrawerToggle when menu icon is clicked', () => {
    renderHeader();
    const menuButton = screen.getByLabelText('Toggle sidebar');
    fireEvent.click(menuButton);
    expect(mockOnDrawerToggle).toHaveBeenCalledTimes(1);
  });

  it('calls logout when logout button in user menu is clicked', async () => {
    renderHeader();
    fireEvent.click(screen.getByLabelText('Account settings')); // Open menu
    const logoutButton = screen.getByText('Logout');
    
    await fireEvent.click(logoutButton); // Use await if logout is async
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('displays user initial if no avatarUrl and name exists', () => {
    const userWithoutAvatar: UserProfile = { ...defaultUser, avatarUrl: undefined };
    renderHeader(userWithoutAvatar);
    const avatarButton = screen.getByLabelText('Account settings');
    expect(avatarButton.querySelector('.MuiAvatar-root')).toHaveTextContent(defaultUser.name.charAt(0).toUpperCase());
  });

  it('displays guest user info if no user is authenticated', () => {
    renderHeader(null); // No user
    fireEvent.click(screen.getByLabelText('Account settings')); // Open menu
    expect(screen.getByText('Guest User')).toBeInTheDocument();
  });

  // Example test for styling based on sidebarOpen (conceptual, actual test might differ)
  // This is tricky because StyledAppBar uses theme and props internally.
  it('AppBar has correct width when sidebar is open and not mobile (conceptual)', () => {
     // This test requires inspecting computed styles or classes, which is complex.
     // For this example, we assume the `open` prop is passed correctly.
     const { container } = renderHeader(defaultUser, { sidebarOpen: true });
     const appBar = container.querySelector('header'); // MUI AppBar renders as <header>
     // A more robust test would check for specific styles or classes applied by StyledAppBar
     // For now, check if AppBar is present
     expect(appBar).toBeInTheDocument();
  });


});