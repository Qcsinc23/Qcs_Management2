import { Box, CircularProgress } from '@mui/material';
import { useRetailRoute, useCorporateRoute } from '../../middleware';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'retail' | 'corporate';
  requireOrganization?: boolean;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({
  children,
  userType,
  requireOrganization = false,
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const { session } = useClerk();
  const navigate = useNavigate();

  // If no specific userType is provided, just check if user is authenticated
  if (!userType) {
    return session ? <>{children}</> : null;
  }

  // Use the appropriate middleware hook based on user type
  const retailAuth = userType === 'retail' 
    ? useRetailRoute(requireOnboarding)
    : null;
  
  const corporateAuth = userType === 'corporate'
    ? useCorporateRoute(requireOnboarding, requireOrganization)
    : null;

  const { isLoaded, isSignedIn, needsOnboarding } = retailAuth || corporateAuth || { 
    isLoaded: false, 
    isSignedIn: false,
    needsOnboarding: false
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && needsOnboarding) {
      navigate(userType === 'retail' ? '/retail/onboarding' : '/corporate/onboarding');
    }
  }, [isLoaded, isSignedIn, needsOnboarding, userType, navigate]);

  const LoadingSpinner = () => (
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

  // Show loading state only while Clerk is initializing
  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // Let the middleware handle redirects for unauthenticated users
  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
