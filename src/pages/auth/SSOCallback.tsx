import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Box, CircularProgress } from '@mui/material';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect_url');

    async function processCallback() {
      try {
        await handleRedirectCallback({
          redirectUrl: redirectUrl || '/',
        });

        // After successful callback, check user type and redirect accordingly
        if (isSignedIn && user) {
          const userType = user.unsafeMetadata.userType as string | undefined;
          const onboardingComplete = user.unsafeMetadata.onboardingComplete as boolean | undefined;

          if (userType && !onboardingComplete) {
            navigate(`/${userType}/onboarding`);
          } else if (userType) {
            navigate(`/${userType}`);
          } else {
            navigate('/sign-in');
          }
        }
      } catch (error) {
        console.error('Error handling SSO callback:', error);
        navigate('/sign-in');
      }
    }

    if (isLoaded) {
      processCallback();
    }
  }, [handleRedirectCallback, isLoaded, isSignedIn, user, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}