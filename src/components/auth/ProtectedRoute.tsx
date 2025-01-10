
import { Box, CircularProgress } from '@mui/material';
import { useRetailRoute, useCorporateRoute } from '../../middleware';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

// Moved outside component to prevent re-creation
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
  // All hooks at the top level
  const { session, loaded: isSessionLoaded } = useClerk();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const retailAuth = useRetailRoute(requireOnboarding);
  const corporateAuth = useCorporateRoute(requireOnboarding, requireOrganization);

  // Use useMemo to memoize auth state selection
  const authState = useMemo(() => {
    if (!userType) return null;
    return userType === 'retail' ? retailAuth : corporateAuth;
  }, [userType, retailAuth, corporateAuth]);

  // Destructure with default values to avoid null checks
  const { isLoaded = false, isSignedIn = false, needsOnboarding = false } = authState ?? {};

  // Initialization effect
  useEffect(() => {
    if (!isSessionLoaded) return;
    
    if (!isInitialized) {
      console.log('ProtectedRoute Initialized:', {
        userType,
        requireOnboarding,
        requireOrganization,
        session: session?.id,
        path: window.location.pathname
      });
      
      if (authState) {
        console.log('Auth State:', {
          isLoaded: authState.isLoaded,
          isSignedIn: authState.isSignedIn,
          needsOnboarding: authState.needsOnboarding,
          user: authState.user?.id
        });
      }

      setIsInitialized(true);
    }
  }, [isSessionLoaded, session, authState, isInitialized, userType, requireOnboarding, requireOrganization]);

  // Onboarding redirect effect
  useEffect(() => {
    if (isLoaded && isSignedIn && needsOnboarding && !window.location.pathname.includes('/onboarding')) {
      const redirectPath = userType === 'retail' ? '/retail/onboarding' : '/corporate/onboarding';
      console.log('Redirecting to onboarding:', redirectPath);
      navigate(redirectPath);
    }
  }, [isLoaded, isSignedIn, needsOnboarding, userType, navigate]);

  // Loading states
  if (!isSessionLoaded || !isInitialized || !isLoaded) {
    return <LoadingSpinner />;
  }

  // No userType check - just verify session
  if (!userType) {
    return session ? <>{children}</> : null;
  }

  // Auth check
  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
