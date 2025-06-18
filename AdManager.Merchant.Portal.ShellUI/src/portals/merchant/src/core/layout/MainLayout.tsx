import React, { ReactNode, useState } from 'react';
import { Box, CssBaseline, styled, useTheme, Theme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NotificationCenter from './NotificationCenter';
import GlobalLoader from '../../components/GlobalLoader'; // Adjusted path as per SDS file structure

const DRAWER_WIDTH = 240;

/**
 * Props for the MainLayout component.
 * @interface MainLayoutProps
 * @property {ReactNode} children - The content to be rendered within the main layout area.
 */
export interface MainLayoutProps {
  children: ReactNode;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
  theme?: Theme; // Explicitly add theme for styled component usage
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme?.spacing(3),
  transition: theme?.transitions.create('margin', {
    easing: theme?.transitions.easing.sharp,
    duration: theme?.transitions.duration.leavingScreen,
  }),
  marginLeft: 0, // Default when sidebar is closed or not present in this style variant
  marginTop: `${theme?.mixins.toolbar.minHeight || 64}px`, // Adjust based on AppBar height
  [theme!.breakpoints.up('sm')]: { // Ensure theme is defined
     marginLeft: `-${DRAWER_WIDTH}px`, // When sidebar is persistent and closed
  },
  ...(open && {
    transition: theme?.transitions.create('margin', {
      easing: theme?.transitions.easing.easeOut,
      duration: theme?.transitions.duration.enteringScreen,
    }),
    [theme!.breakpoints.up('sm')]: { // Ensure theme is defined
        marginLeft: 0,
    }
  }),
}));


/**
 * `MainLayout` provides the consistent visual structure for authenticated pages
 * within the merchant portal. It includes a Header, Sidebar, main content area, and Footer.
 * It also renders global components like `NotificationCenter` and `GlobalLoader`.
 * This layout is typically used in `_app.tsx` to wrap page components in a Next.js application.
 *
 * @param {MainLayoutProps} props - The props for the component.
 * @returns {React.ReactElement} The main layout structure.
 * @see {@link REQ-6-011} - Accessibility considerations for layout.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open on larger screens

  /**
   * Toggles the open/close state of the sidebar.
   */
  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} sidebarOpen={sidebarOpen} drawerWidth={DRAWER_WIDTH} />
      <Sidebar open={sidebarOpen} onClose={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: `${theme.mixins.toolbar.minHeight || 64}px`, // Space for Header
          paddingLeft: {
            xs: 0, // No margin for sidebar on small screens (it's temporary)
            sm: sidebarOpen ? `${DRAWER_WIDTH}px` : 0, // Margin for persistent sidebar
          },
          transition: theme.transitions.create(['margin', 'padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box sx={{ p: 3, flexGrow: 1 }}>
         {children}
        </Box>
        <Footer />
      </Box>
      <NotificationCenter />
      <GlobalLoader />
    </Box>
  );
};

export default MainLayout;