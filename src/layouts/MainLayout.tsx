import type { ReactNode } from 'react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as EventIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material'
import { useTheme as useCustomTheme } from '../theme/ThemeContext'

interface MainLayoutProps {
  children: ReactNode
}

const DRAWER_WIDTH = 280

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation()
  const theme = useTheme()
  const { mode, toggleTheme } = useCustomTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const isActiveRoute = (path: string): boolean => {
    return location.pathname === path
  }

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/booking', label: 'Booking', icon: <ShippingIcon /> },
    { path: '/tracking', label: 'Tracking', icon: <ShippingIcon /> },
    { path: '/inventory', label: 'Inventory', icon: <InventoryIcon /> },
    { path: '/events', label: 'Events', icon: <EventIcon /> },
    { path: '/reports', label: 'Reports', icon: <ReportsIcon /> },
    { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          QCS Management
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 2 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: isActiveRoute(item.path)
                ? theme.palette.primary.main
                : theme.palette.text.primary,
              backgroundColor: isActiveRoute(item.path)
                ? theme.palette.primary.main + '10'
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActiveRoute(item.path)
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 QCS Management
        </Typography>
        <IconButton onClick={toggleTheme} size="small">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', left: 16, top: 16, zIndex: 1200 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: theme.shadows[2],
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout
