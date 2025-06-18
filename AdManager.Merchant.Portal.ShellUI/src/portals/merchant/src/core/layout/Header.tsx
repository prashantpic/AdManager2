import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  useTheme,
  useMediaQuery,
  styled,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings'; // Example icon for Profile
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import useAuth from '../auth/useAuth'; // Assuming useAuth provides currentUser and logout
import { useSelector } from 'react-redux';
import { selectMerchantProfile } from '../state/slices/merchantContextSlice';
import { AppConfig } from '../../config/env';

const LOGO_URL = '/logo.png'; // Placeholder for logo, replace with actual path or import

/**
 * Props for the Header component.
 * @interface HeaderProps
 * @property {() => void} onDrawerToggle - Callback function to toggle the sidebar, typically on mobile.
 * @property {boolean} sidebarOpen - Current state of the sidebar (open or closed).
 * @property {number} drawerWidth - The width of the drawer/sidebar.
 */
export interface HeaderProps {
  onDrawerToggle: () => void;
  sidebarOpen: boolean;
  drawerWidth: number;
}

const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
  })<{ open?: boolean; drawerWidth: number }>(({ theme, open, drawerWidth }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.down('sm')]: { // On small screens, AppBar should take full width even if sidebar is "open" (as temporary)
        width: '100%',
        marginLeft: 0,
      },
    }),
  }));


/**
 * `Header` component for the application.
 * It displays the application logo/name, a language switcher, notification icon,
 * and a user menu with profile and logout options.
 * It also includes a toggle button for the sidebar on smaller screens.
 *
 * @param {HeaderProps} props - The props for the component.
 * @returns {React.ReactElement} The application header.
 * @see {@link REQ-6-011} - Accessibility: Ensure controls are keyboard accessible and properly labeled.
 * @see {@link REQ-6-012} - Internationalization: User-facing strings are translatable.
 */
const Header: React.FC<HeaderProps> = ({ onDrawerToggle, sidebarOpen, drawerWidth }) => {
  const { t } = useTranslation(['shell', 'common']);
  const { logout } = useAuth(); // Use useAuth for logout
  const merchantProfile = useSelector(selectMerchantProfile); // Get profile from Redux
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    if (logout) {
      await logout();
    }
  };

  return (
    <StyledAppBar position="fixed" open={sidebarOpen && !isMobile} drawerWidth={drawerWidth} enableColorOnDark>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label={t('header.toggleSidebar', 'Toggle sidebar')}
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }} // Removed display logic, always show for simplicity, Sidebar controls its own visibility
        >
          <MenuIcon />
        </IconButton>

        <Link href={AppConfig.DEFAULT_LOGGED_IN_REDIRECT_PATH || "/dashboard"} passHref legacyBehavior>
          <MuiLink component="a" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            {/* Replace with actual logo component or img tag if using a raster image */}
            {/* <img src={LOGO_URL} alt={t('common:appName', 'Ad Manager Platform')} style={{ height: 32, marginRight: theme.spacing(1) }} /> */}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: { xs: 1, sm: 0 } }}>
              {t('common:appName', 'Ad Manager')}
            </Typography>
          </MuiLink>
        </Link>


        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageSwitcher />

          <IconButton
            color="inherit"
            aria-label={t('header.notifications', 'View notifications')}
            onClick={handleOpenNotificationsMenu}
            aria-controls={anchorElNotifications ? 'notifications-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorElNotifications ? 'true' : undefined}
          >
            <Badge badgeContent={0} color="error"> {/* Placeholder badge content */}
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            id="notifications-menu"
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
            MenuListProps={{
              'aria-labelledby': 'notifications-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom'}}
          >
            <MenuItem onClick={handleCloseNotificationsMenu} disabled>
              <Typography textAlign="center">{t('header.noNotifications', 'No new notifications')}</Typography>
            </MenuItem>
            {/* Placeholder for future notifications list */}
          </Menu>


          <IconButton
            onClick={handleOpenUserMenu}
            size="large"
            aria-label={t('header.userMenuAriaLabel', 'Account settings')}
            aria-controls={anchorElUser ? 'user-menu-appbar': undefined}
            aria-haspopup="true"
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }} alt={merchantProfile?.name || 'User'} src={merchantProfile?.avatarUrl /* Placeholder for avatar if available */}>
                {!merchantProfile?.avatarUrl && merchantProfile?.name ? merchantProfile.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
          </IconButton>
          <Menu
            id="user-menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Box sx={{ py: 1, px: 2 }}>
                <Typography variant="subtitle1" component="div" noWrap>
                    {merchantProfile?.name || t('header.guest', 'Guest User')}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {merchantProfile?.email}
                </Typography>
            </Box>
            <Divider />
            <Link href="/settings/profile" passHref legacyBehavior>
              <MenuItem onClick={handleCloseUserMenu} component="a">
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                {t('header.profile', 'Profile')}
              </MenuItem>
            </Link>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              {t('header.logout', 'Logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};


// MuiLink for Next.js Link compatibility
const MuiLink = styled('a')({});


export default Header;