import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import {
  AccountCircle as AccountIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import { Link, Outlet, useLocation } from 'react-router-dom'
import ChatWidget from '../components/common/ChatWidget'

export default function RetailLayout() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/retail"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
            }}
          >
            QCS Express
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/retail/track"
              color="inherit"
              sx={{
                textTransform: 'none',
                fontWeight: isActive('/retail/track') ? 600 : 400,
              }}
            >
              Track Package
            </Button>

            <Button
              component={Link}
              to="/retail/book"
              variant={isActive('/retail/book') ? 'contained' : 'outlined'}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Book Now
            </Button>

            <IconButton
              color="inherit"
              component={Link}
              to="/retail/help"
              size="large"
              sx={{
                backgroundColor: isActive('/retail/help') ? 'action.selected' : 'transparent',
              }}
            >
              <HelpIcon />
            </IconButton>

            <SignedOut>
              <IconButton
                color="inherit"
                size="large"
                component={Link}
                to="/sign-in?userType=retail"
              >
                <AccountIcon />
              </IconButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px', // Height of AppBar
          backgroundColor: '#f5f5f5',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            QCS Express. All rights reserved.
          </Typography>
        </Container>
      </Box>

      <ChatWidget />
    </Box>
  )
}
