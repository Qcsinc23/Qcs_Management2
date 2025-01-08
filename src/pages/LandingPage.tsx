import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Business as CorporateIcon,
  Person as RetailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    // Check if user is already signed in and has a type
    if (isSignedIn && user) {
      const userType = user.unsafeMetadata.userType as 'retail' | 'corporate';
      const onboardingComplete = user.unsafeMetadata.onboardingComplete as boolean;
      
      if (userType) {
        navigate(onboardingComplete ? `/${userType}` : `/${userType}/onboarding`);
      }
    }
  }, [isSignedIn, user, navigate]);

  const handlePortalSelect = async (type: 'retail' | 'corporate') => {
    localStorage.setItem('userType', type);
    
    if (!isSignedIn) {
      // If not signed in, redirect to sign-in with return URL
      const searchParams = new URLSearchParams();
      searchParams.set('redirect_url', `/${type}/onboarding`);
      searchParams.set('userType', type);
      navigate(`/sign-in?${searchParams.toString()}`);
      return;
    }

    if (user) {
      try {
        // If user is already signed in, update their type and redirect
        await user.update({
          unsafeMetadata: {
            userType: type,
            onboardingComplete: false,
          },
        });
        navigate(`/${type}/onboarding`);
      } catch (error) {
        console.error('Error updating user type:', error);
      }
    }
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', py: 8 }}>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{
                color: 'white',
                mb: 6,
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '2.5rem', md: '3.75rem' },
              }}
            >
              Welcome to QCS Management
            </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Corporate Card */}
            <Grid item xs={12} md={6} lg={5}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[10],
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme.palette.primary.main,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <CorporateIcon
                      sx={{
                        fontSize: 60,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="h2"
                    align="center"
                    sx={{ mb: 3 }}
                  >
                    Corporate Portal
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Access your corporate account to manage events, inventory, logistics, and more.
                    Full-featured management tools for business clients.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    onClick={() => handlePortalSelect('corporate')}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Enter Corporate Portal
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Retail Card */}
            <Grid item xs={12} md={6} lg={5}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[10],
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme.palette.secondary.main,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <RetailIcon
                      sx={{
                        fontSize: 60,
                        color: theme.palette.secondary.main,
                      }}
                    />
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="h2"
                    align="center"
                    sx={{ mb: 3 }}
                  >
                    Retail Services
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Quick and easy shipping solutions for individual customers.
                    Book deliveries, track packages, and manage your shipments.
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    onClick={() => handlePortalSelect('retail')}
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Enter Retail Portal
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: alpha('#000', 0.1),
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ color: 'white' }}>
            © {new Date().getFullYear()} QCS Management. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
