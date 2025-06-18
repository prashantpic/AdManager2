import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Box,
  useTheme,
  styled,
  ListSubheader,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavItem, navConfig } from '../navigation/navConfig'; // Assuming navConfig is in this path
import { selectMerchantProfile } from '../state/slices/merchantContextSlice'; // For permissions
import { UserProfile } from '../auth/auth.types';

/**
 * Props for the Sidebar component.
 * @interface SidebarProps
 * @property {boolean} open - Whether the sidebar is currently open.
 * @property {() => void} onClose - Callback function to close the sidebar (e.g., on mobile overlay click).
 * @property {number} drawerWidth - The width of the sidebar drawer.
 */
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
    drawerWidth: number;
  }>(({ theme, open, drawerWidth }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper, // Or a specific sidebar background
      color: theme.palette.text.primary,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden', // Prevent horizontal scrollbar during transition
    },
    ...(!open && { // Styles when closed, for mini-variant or completely hidden
        '& .MuiDrawer-paper': {
            width: theme.spacing(7), // Example for a collapsed sidebar
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
    }),
}));


/**
 * `Sidebar` component provides the main navigation for the application.
 * It renders navigation items based on `navConfig` and filters them
 * according to the authenticated merchant's permissions.
 *
 * @param {SidebarProps} props - The props for the component.
 * @returns {React.ReactElement} The application sidebar.
 * @see {@link REQ-6-011} - Accessibility: Ensure navigation is keyboard accessible and items are properly labeled.
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const { t } = useTranslation(['shell', 'common']);
  const router = useRouter();
  const merchantProfile = useSelector(selectMerchantProfile);
  const theme = useTheme();
  const [openSubmenus, setOpenSubmenus] = React.useState<Record<string, boolean>>({});

  const userPermissions = merchantProfile?.permissions || [];

  const hasPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }
    if (!merchantProfile) return false; // No user, no permissions
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  };

  const handleSubmenuClick = (id: string) => {
    setOpenSubmenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNavItems = (items: NavItem[], depth = 0): React.ReactNode[] => {
    return items
      .filter(item => hasPermission(item.requiredPermissions))
      .map((item) => {
        const isActive = router.pathname === item.path || (item.path !== '/' && router.pathname.startsWith(item.path || ''));
        const hasChildren = item.children && item.children.length > 0;
        const isSubmenuOpen = openSubmenus[item.id] || false;

        if (hasChildren) {
          return (
            <React.Fragment key={item.id}>
              <ListItemButton
                onClick={() => handleSubmenuClick(item.id)}
                selected={isActive && !isSubmenuOpen} // Selected if path matches and submenu is not the primary focus
                sx={{
                  pl: theme.spacing(2 + depth * 2), // Indentation for depth
                  ...(isActive && {
                    backgroundColor: theme.palette.action.selected,
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                       color: theme.palette.primary.main,
                    },
                  }),
                }}
              >
                {item.icon && <ListItemIcon sx={{ minWidth: 40, color: isActive ? theme.palette.primary.main : 'inherit' }}>{React.createElement(item.icon)}</ListItemIcon>}
                {open && <ListItemText primary={t(item.labelKey, item.labelKey.split('.').pop())} />}
                {open && (isSubmenuOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={isSubmenuOpen && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderNavItems(item.children!, depth + 1)}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }

        return (
          <Link href={item.path || '#'} passHref legacyBehavior key={item.id}>
            <ListItemButton
              component="a"
              selected={isActive}
              onClick={onClose} // Close sidebar on mobile when an item is clicked
              sx={{
                pl: theme.spacing(2 + depth * 2),
                ...(isActive && {
                  backgroundColor: theme.palette.action.selected,
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                     color: theme.palette.primary.main,
                  },
                }),
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon && <ListItemIcon sx={{ minWidth: 40, color: isActive ? theme.palette.primary.main : 'inherit' }}>{React.createElement(item.icon)}</ListItemIcon>}
              {open && <ListItemText primary={t(item.labelKey, item.labelKey.split('.').pop())} />}
            </ListItemButton>
          </Link>
        );
      });
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 1 }}>
        {/* Optional: Logo or App Name in Sidebar Header */}
        {open && (
             <Link href={AppConfig.DEFAULT_LOGGED_IN_REDIRECT_PATH || "/dashboard"} passHref legacyBehavior>
                <Box component="a" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    {/* <img src="/logo.png" alt="Logo" style={{ height: 32, marginRight: theme.spacing(1) }} /> */}
                    <Typography variant="h6" color="text.primary">
                        {t('common:appNameShort', 'AdMgr')}
                    </Typography>
                </Box>
            </Link>
        )}
      </Toolbar>
      <Divider />
      <List
        component="nav"
        aria-labelledby="main-navigation"
        subheader={
            open ? (
                <ListSubheader component="div" inset sx={{ bgcolor: 'transparent', color: theme.palette.text.secondary}}>
                    {t('navigation.mainMenu', 'Main Menu')}
                </ListSubheader>
            ) : null
        }
      >
        {renderNavItems(navConfig)}
      </List>
    </>
  );

  return (
    <StyledDrawer
      variant={useTheme().breakpoints.up('sm') ? "persistent" : "temporary"} // Persistent on sm and up, temporary on xs
      anchor="left"
      open={open}
      onClose={onClose} // For temporary drawer on mobile
      drawerWidth={drawerWidth}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </StyledDrawer>
  );
};

export default Sidebar;