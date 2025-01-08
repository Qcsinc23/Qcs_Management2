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
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserButton, SignedIn } from '@clerk/clerk-react';
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
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            QCS Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <OrganizationSwitcher />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
