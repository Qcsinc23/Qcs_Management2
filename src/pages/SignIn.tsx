import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Business as CorporateIcon,
  Person as RetailIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SignIn as ClerkSignIn,
  useUser,
  useClerk,
} from '@clerk/clerk-react';

type UserType = 'retail' | 'corporate' | null;

export default function SignIn() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isSignedIn, user } = useUser();
  const { session } = useClerk();

  // Parse URL parameters and localStorage
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect_url');
  const userTypeParam = searchParams.get('userType') as UserType;
  
  useEffect(() => {
    // Check localStorage first, then URL param
    const storedType = localStorage.getItem('userType') as UserType;
    if (storedType) {
      setSelectedType(storedType);
    } else if (userTypeParam) {
      setSelectedType(userTypeParam);
      if (userTypeParam) {
        localStorage.setItem('userType', userTypeParam);
      }
    }
  }, [userTypeParam]);

  useEffect(() => {
    const handleSignedInUser = async () => {
      if (!isSignedIn || !user) return;

      const currentUserType = user.unsafeMetadata.userType as UserType;
      const onboardingComplete = user.unsafeMetadata.onboardingComplete as boolean;

      // If user has a type, check onboarding status
      if (currentUserType) {
        if (!onboardingComplete) {
          navigate(`/${currentUserType}/onboarding`);
        } else if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate(`/${currentUserType}`);
        }
      }
      // If user doesn't have a type yet, let them select one
    }

    handleSignedInUser();
  }, [isSignedIn, user, navigate, redirectUrl]);

  const handleTypeSelect = async (type: 'retail' | 'corporate') => {
    setSelectedType(type);
    localStorage.setItem('userType', type);

    // If user is already signed in, update their type and redirect
    if (isSignedIn && user) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            userType: type,
            onboardingComplete: false,
            onboardingCompletedAt: null
          },
        });

        // Force session token refresh to include new metadata
        await session?.reload();

        // Redirect to appropriate onboarding
        navigate(`/${type}/onboarding`);
      } catch (err) {
        console.error('Error updating user type:', err);
      }
    }
  };

  // Handle successful sign-in
  useEffect(() => {
    if (isSignedIn && user) {
      const userType = user.unsafeMetadata.userType as UserType;
      const onboardingComplete = user.unsafeMetadata.onboardingComplete as boolean;
      const storedType = localStorage.getItem('userType') as UserType;

      // If user doesn't have a type yet, set it from localStorage
      if (!userType && storedType) {
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            userType: storedType,
            onboardingComplete: false,
            onboardingCompletedAt: null
          },
        }).then(() => {
          session?.reload();
          navigate(`/${storedType}/onboarding`);
        });
      } else if (userType) {
        // Redirect based on user type and onboarding status
        if (!onboardingComplete) {
          navigate(`/${userType}/onboarding`);
        } else {
          navigate(userType === 'corporate' ? '/corporate' : '/retail');
        }
      }
    }
  }, [isSignedIn, user, navigate, session]);

  if (selectedType) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {selectedType === 'corporate' ? 'Corporate Sign In' : 'Welcome Back'}
          </Typography>
          <Typography color="text.secondary">
            {selectedType === 'corporate'
              ? 'Access your corporate account'
              : 'Sign in to your retail account'}
          </Typography>
        </Box>
        <ClerkSignIn
          routing="path"
          path="/sign-in"
          fallbackRedirectUrl={redirectUrl || `/${selectedType}`}
          appearance={{
            elements: {
              rootBox: {
                boxShadow: 'none',
                width: '100%',
              },
              card: {
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
              },
              formButtonPrimary: {
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              formFieldInput: {
                borderColor: theme.palette.divider,
              },
              footerActionLink: {
                color: theme.palette.primary.main,
              },
            },
          }}
        />
        {!userTypeParam && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={() => setSelectedType(null)}
              sx={{ textTransform: 'none' }}
            >
              ← Back to selection
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to QCS Management
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 8 }}
      >
        Choose how you'd like to sign in
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Retail Card */}
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              },
            }}
            onClick={() => handleTypeSelect('retail')}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  mb: 3,
                }}
              >
                <RetailIcon
                  sx={{ fontSize: 40, color: theme.palette.primary.main }}
                />
              </Box>
              <Typography variant="h5" gutterBottom>
                Individual Customer
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Book deliveries, track packages, and manage your shipments
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ArrowIcon />}
                sx={{ mt: 'auto' }}
              >
                Continue as Individual
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Corporate Card */}
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              },
            }}
            onClick={() => handleTypeSelect('corporate')}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  mb: 3,
                }}
              >
                <CorporateIcon
                  sx={{ fontSize: 40, color: theme.palette.secondary.main }}
                />
              </Box>
              <Typography variant="h5" gutterBottom>
                Corporate Client
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Access advanced features, bulk shipping, and business analytics
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                endIcon={<ArrowIcon />}
                sx={{ mt: 'auto' }}
              >
                Continue as Business
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
