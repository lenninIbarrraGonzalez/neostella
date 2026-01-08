import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  SxProps,
  Theme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  Assignment as TaskIcon,
  CalendarMonth as CalendarIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../constants/permissions';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

const getNavItemStyles = (isActive: boolean, isOpen: boolean): SxProps<Theme> => ({
  borderRadius: 2,
  minHeight: 48,
  justifyContent: isOpen ? 'initial' : 'center',
  px: 2.5,
  backgroundColor: isActive ? 'primary.main' : 'transparent',
  color: isActive ? 'white' : 'text.primary',
  '&:hover': {
    backgroundColor: isActive ? 'primary.dark' : 'primary.light',
    color: isActive ? 'white' : 'primary.main',
    '& .MuiListItemIcon-root': {
      color: isActive ? 'white' : 'primary.main',
    },
  },
  '& .MuiListItemIcon-root': {
    color: isActive ? 'white' : 'text.secondary',
  },
});

const navIconStyles = (isOpen: boolean): SxProps<Theme> => ({
  minWidth: 0,
  mr: isOpen ? 2 : 'auto',
  justifyContent: 'center',
});

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  path: string;
  icon: React.ReactNode;
  labelKey: string;
  permission?: string;
}

const navItems: NavItem[] = [
  { path: '/app/dashboard', icon: <DashboardIcon />, labelKey: 'nav.dashboard' },
  { path: '/app/cases', icon: <FolderIcon />, labelKey: 'nav.cases' },
  { path: '/app/clients', icon: <PeopleIcon />, labelKey: 'nav.clients' },
  { path: '/app/tasks', icon: <TaskIcon />, labelKey: 'nav.tasks' },
  { path: '/app/calendar', icon: <CalendarIcon />, labelKey: 'nav.calendar' },
  { path: '/app/time-tracking', icon: <TimerIcon />, labelKey: 'nav.timeTracking' },
  { path: '/app/settings', icon: <SettingsIcon />, labelKey: 'nav.settings', permission: PERMISSIONS.SETTINGS_VIEW },
];

export function Sidebar({ open, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const visibleItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission as any);
  });

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
        }}
      >
        {open && (
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'primary.main' }}>
            Neostella
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={onToggle} size="small">
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/app/dashboard' && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={isMobile ? onMobileClose : undefined}
                sx={getNavItemStyles(isActive, open)}
              >
                <ListItemIcon sx={navIconStyles(open)}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={t(item.labelKey)} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User info */}
      {user && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          {open && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {t(`common:roles.${user.role}`)}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;
