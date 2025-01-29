import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, Divider } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Inventory as InventoryIcon,
  LocalShipping as LogisticsIcon,
  Assessment as ReportIcon,
  People as UserIcon,
  Settings as SettingIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, useUser } from '@clerk/clerk-react';
import OrganizationSwitcher from '../components/corporate/OrganizationSwitcher';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/corporate' },
  { text: 'Events', icon: <EventIcon />, path: '/corporate/events' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/corporate/inventory' },
  { text: 'Logistics', icon: <LogisticsIcon />, path: '/corporate/logistics' },
  { text: 'Reports', icon: <ReportIcon />, path: '/corporate/reports' },
  { text: 'Users', icon: <UserIcon />, path: '/corporate/users' },
  { text: 'Settings', icon: <SettingIcon />, path: '/corporate/settings' },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { user, isLoaded } = useUser();
  const location = useLocation();
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const onboardingComplete = user.unsafeMetadata?.onboardingComplete as boolean;
      const userType = user.unsafeMetadata?.userType as string;
      const shouldShowNav = onboardingComplete && userType === 'corporate';
      
      // Only update if the value actually changed to prevent unnecessary re-renders
      if (shouldShowNav !== showNavigation) {
        setShowNavigation(shouldShowNav);
      }
    }
  }, [isLoaded, user, showNavigation]);

  // If in onboarding, only show the main content without navigation
  if (location.pathname.includes('/onboarding')) {
    return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
        }}
      >
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              QCS Management
            </Typography>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <OrganizationSwitcher />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          {showNavigation && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            QCS Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {showNavigation && <OrganizationSwitcher />}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      {showNavigation && (
        <Box
          component="nav"
          sx={{ 
            width: { sm: drawerWidth }, 
            flexShrink: { sm: 0 },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
