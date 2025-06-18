import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useRouter } from 'next/router';
import i18n from 'i18next'; // Your actual i18n instance or a mock
import Sidebar, { SidebarProps } from './Sidebar';
import { navConfig, NavItem } from '../navigation/navConfig'; // Ensure navConfig is correctly imported/mocked
import { UserProfile } from '../auth/auth.types';
import HomeIcon from '@mui/icons-material/Home'; // Example Icon
import SettingsIcon from '@mui/icons-material/Settings'; // Example Icon
import FolderIcon from '@mui/icons-material/Folder'; // Example Icon

// Mock i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key.split('.').pop() || key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
const mockUseRouter = useRouter as jest.Mock;

// Mock navConfig if it's complex or has external dependencies
jest.mock('../navigation/navConfig', () => ({
  navConfig: [
    { id: 'dashboard', labelKey: 'navigation.dashboard', path: '/dashboard', icon: HomeIcon, requiredPermissions: ['view_dashboard'] },
    { id: 'content', labelKey: 'navigation.content', path: '/content', icon: FolderIcon, requiredPermissions: ['manage_content'],
      children: [
          { id: 'landingPages', labelKey: 'navigation.landingPages', path: '/content/landing-pages', icon: HomeIcon, requiredPermissions: ['manage_landing_pages'] },
      ]
    },
    { id: 'settings', labelKey: 'navigation.settings', path: '/settings', icon: SettingsIcon }, // No permissions needed
  ] as NavItem[],
}));


const theme = createTheme();
const mockStore = configureStore([]);

describe('Sidebar', () => {
  let store: any;
  const mockOnClose = jest.fn();

  const defaultUser: UserProfile = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    merchantId: 'merchant1',
    roles: ['admin'],
    permissions: ['view_dashboard', 'manage_content', 'manage_landing_pages'],
  };

  const defaultProps: SidebarProps = {
    open: true,
    onClose: mockOnClose,
    drawerWidth: 240,
  };

  const renderSidebar = (user: UserProfile | null = defaultUser, currentPath: string = '/dashboard', props: Partial<SidebarProps> = {}) => {
    mockUseRouter.mockReturnValue({
      pathname: currentPath,
      push: jest.fn(),
      // Add other router properties if used
    });
    const initialState = {
      merchantContext: { profile: user, isLoading: false, error: null },
      // Add other slices if needed
    };
    store = mockStore(initialState);

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <Sidebar {...defaultProps} {...props} />
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation items based on navConfig and user permissions', () => {
    renderSidebar();
    expect(screen.getByText('dashboard')).toBeInTheDocument(); // from labelKey
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByText('settings')).toBeInTheDocument();
  });

  it('filters out items if user lacks permissions', () => {
    const userWithLimitedPermissions: UserProfile = { ...defaultUser, permissions: ['view_dashboard'] };
    renderSidebar(userWithLimitedPermissions);
    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument(); // Should be filtered out
    expect(screen.getByText('settings')).toBeInTheDocument(); // No permission needed
  });

  it('highlights the active navigation item', () => {
    renderSidebar(defaultUser, '/dashboard');
    const dashboardLink = screen.getByText('dashboard').closest('a'); // Find the wrapping Link/anchor
    expect(dashboardLink).toHaveAttribute('aria-current', 'page'); // MUI selected might use different attributes or classes
    // More robustly, check for MUI's `selected` class or style if possible
  });

  it('handles submenu expansion and collapse', () => {
    renderSidebar(defaultUser, '/content'); // A route that's not a child
    const contentMenu = screen.getByText('content');
    fireEvent.click(contentMenu); // Click to expand

    // Check if child is visible
    expect(screen.getByText('landingPages')).toBeInTheDocument();

    fireEvent.click(contentMenu); // Click to collapse
    // This check is tricky because Collapse unmountsOnExit.
    // We might need to wait or check for absence.
    // For simplicity, we assume one click expands and another collapses the internal state.
    // A better test would check the `in` prop of Collapse if it were accessible or through visual state.
    // If not immediately removed, check for aria-expanded or similar attribute change.
    expect(screen.queryByText('landingPages')).not.toBeInTheDocument(); // Assuming it collapses and unmounts
  });


  it('calls onClose when a navigation item is clicked (for mobile behavior)', () => {
    renderSidebar(defaultUser, '/');
    const dashboardLink = screen.getByText('dashboard');
    fireEvent.click(dashboardLink);
    // For non-submenu items, onClose should be called.
    // For submenu parent items, onClick toggles submenu, onClose is not directly called.
    // The current implementation calls onClose for all items, which is fine for temporary drawers.
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders correctly when closed (sidebarOpen=false) showing only icons if designed so', () => {
    renderSidebar(defaultUser, '/dashboard', { open: false });
    // Text labels should not be visible or significantly reduced
    expect(screen.queryByText('dashboard')).not.toBeInTheDocument(); // Assuming text is hidden when closed
    // Icons should still be there (check by testId or role if icons have them)
    // This depends heavily on how the "closed" state is styled (e.g., mini-variant)
    const homeIcons = screen.getAllByTestId('HomeIcon'); // MUI icons often have a testid like this
    expect(homeIcons.length).toBeGreaterThan(0);
  });

  it('renders app name in toolbar when open', () => {
    renderSidebar(defaultUser, '/dashboard', { open: true });
    expect(screen.getByText('AdMgr')).toBeInTheDocument();
  });

  it('does not render app name in toolbar when closed', () => {
    renderSidebar(defaultUser, '/dashboard', { open: false });
    expect(screen.queryByText('AdMgr')).not.toBeInTheDocument();
  });

});