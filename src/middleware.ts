import { useUser, useClerk } from '@clerk/clerk-react';
import { fetchOrganizationDetails, OrganizationDetails } from './services/organization';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Enhanced CSP configuration for Clerk with additional security headers
export const SECURITY_HEADERS = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 
      'self' 
      'unsafe-inline' 
      'unsafe-eval' 
      https://*.clerk.com 
      https://*.clerk.accounts.dev 
      https://*.stripe.com
      https://js.stripe.com
      https://clerk.com
      https://accounts.clerk.com
      https://*.clerk.dev;
    connect-src 
      'self' 
      https://*.clerk.com 
      https://*.clerk.accounts.dev 
      https://api.stripe.com
      https://checkout.stripe.com
      https://clerk.com
      https://accounts.clerk.com
      https://*.clerk.dev
      wss://*.clerk.com
      wss://*.clerk.accounts.dev;
    img-src 
      'self' 
      https://*.clerk.com 
      https://*.clerk.accounts.dev 
      https://clerk.com
      https://accounts.clerk.com
      data: 
      https: 
      blob:;
    style-src 
      'self' 
      'unsafe-inline' 
      https://*.clerk.com 
      https://*.clerk.accounts.dev 
      https://clerk.com
      https://accounts.clerk.com
      https://fonts.googleapis.com
      https://js.stripe.com;
    font-src 
      'self' 
      https://*.clerk.com 
      https://*.clerk.accounts.dev 
      https://clerk.com
      https://accounts.clerk.com
      https://fonts.gstatic.com 
      data: 
      https://js.stripe.com;
    frame-src 
      'self' 
      https://*.clerk.com 
      https://*.clerk.accounts.dev 
      https://clerk.com
      https://accounts.clerk.com
      https://*.stripe.com
      https://js.stripe.com
      https://checkout.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    worker-src 'self' blob:;
    media-src 'self' blob: data:;
  `.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim(),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Export security headers for server-side use
export const CSP_HEADERS = SECURITY_HEADERS;

// Apply security headers to all responses
export const applySecurityHeaders = (response: Response) => {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    response.headers.set(header, value);
  });
  return response;
};

interface OrganizationMetadata {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface UseAuthMiddlewareProps {
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  allowedUserTypes?: Array<'retail' | 'corporate'>;
  requireOrganization?: boolean;
}

export function useAuthMiddleware({
  requireAuth = false,
  requireOnboarding = false,
  allowedUserTypes = [],
  requireOrganization = false,
}: UseAuthMiddlewareProps = {}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { session } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded) return;

    const handleAuth = async () => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        // If authentication is required and user is not signed in
        if (requireAuth && !isSignedIn) {
          const searchParams = new URLSearchParams();
          searchParams.set('redirect_url', location.pathname + location.search);
          
          // Get user type from URL path or localStorage
          let userType = location.pathname.split('/')[1];
          if (userType !== 'retail' && userType !== 'corporate') {
            userType = localStorage.getItem('userType') || '';
          }
          
          if (userType) {
            searchParams.set('userType', userType);
            localStorage.setItem('userType', userType);
          }

          // Store current state in session storage
          sessionStorage.setItem('preAuthState', JSON.stringify({
            path: location.pathname,
            search: location.search,
            state: location.state
          }));
          
          navigate(`/sign-in?${searchParams.toString()}`);
          return;
        }

        // Restore pre-auth state if available
        const preAuthState = sessionStorage.getItem('preAuthState');
        if (preAuthState && isSignedIn) {
          const { path, search, state } = JSON.parse(preAuthState);
          sessionStorage.removeItem('preAuthState');
          
          // Only restore if the current path is the sign-in page
          if (location.pathname === '/sign-in') {
            navigate(path + search, { state, replace: true });
            return;
          }
        }

        // If user is signed in, check additional requirements
        if (isSignedIn && user) {
          // Validate session state
          if (!session) {
            throw new Error('Session is not available');
          }

          // Ensure metadata exists with proper typing
          if (!user.unsafeMetadata || typeof user.unsafeMetadata !== 'object') {
            await user.update({
              unsafeMetadata: {
                userType: '',
                onboardingComplete: false,
                currentOrganization: null,
                metadataVersion: 1
              }
            });
            await session.reload();
            return; // Allow useEffect to trigger again with updated metadata
          }

          const userType = user.unsafeMetadata.userType as string | undefined;
          const onboardingComplete = user.unsafeMetadata.onboardingComplete as boolean | undefined;

          // Check if user type is allowed
          if (allowedUserTypes.length > 0) {
          // If user doesn't have a type yet, check localStorage and URL path
          if (!userType) {
            const storedType = localStorage.getItem('userType');
            const pathType = location.pathname.split('/')[1];
            
            // Determine type from most reliable source
            const determinedType = 
              allowedUserTypes.includes(pathType as 'retail' | 'corporate') ? pathType :
              storedType && allowedUserTypes.includes(storedType as 'retail' | 'corporate') ? storedType :
              null;

            if (determinedType) {
              await user.update({
                unsafeMetadata: {
                  ...user.unsafeMetadata,
                  userType: determinedType,
                  onboardingComplete: false
                }
              });
              await session?.reload();
              
              // Store type in localStorage for consistency
              localStorage.setItem('userType', determinedType);
              
              // Redirect to onboarding with proper state
              navigate(`/${determinedType}/onboarding`, {
                state: {
                  from: location.pathname,
                  requiresOnboarding: true,
                  userType: determinedType
                },
                replace: true
              });
              return;
            }
          }
            
          // If user has a type that's not allowed, redirect with proper state
          if (userType && !allowedUserTypes.includes(userType as 'retail' | 'corporate')) {
            navigate(`/${userType}`, {
              state: {
                from: location.pathname,
                restricted: true,
                allowedTypes: allowedUserTypes,
                currentType: userType
              },
              replace: true
            });
            return;
          }
          }

          // Check if onboarding is required with proper state
          if (requireOnboarding && !onboardingComplete && !location.pathname.includes('/onboarding')) {
            navigate(`/${userType}/onboarding`, {
              state: {
                from: location.pathname,
                requiresOnboarding: true,
                userType: userType
              },
              replace: true
            });
            return;
          }

          // Check if organization is required (for corporate users)
          if (requireOrganization && userType === 'corporate' && onboardingComplete) {
            try {
              // Enhanced organization validation with detailed error tracking and type safety
              const organization = user?.unsafeMetadata?.currentOrganization as OrganizationMetadata | undefined;
              const validationErrors: string[] = [];
              
              // Early return if organization is missing
              if (!organization) {
                validationErrors.push('Organization metadata is missing');
                console.warn('Organization validation failed:', validationErrors.join(', '));
                return {
                  isValid: false,
                  errors: validationErrors,
                  organization: null
                };
              }

              // Validate organization structure
              if (typeof organization !== 'object') {
                validationErrors.push('Organization metadata is not an object');
              }
              if (typeof organization.id !== 'string' || organization.id.length === 0) {
                validationErrors.push('Organization ID is invalid');
              }
              if (typeof organization.name !== 'string' || organization.name.length === 0) {
                validationErrors.push('Organization name is invalid');
              }
              if (organization.lastUpdated && typeof organization.lastUpdated !== 'number') {
                validationErrors.push('Last updated timestamp is invalid');
              }

              const isValidOrganization = validationErrors.length === 0;
              if (!isValidOrganization) {
                console.warn('Organization validation failed:', validationErrors.join(', '));
              }

              return {
                isValid: isValidOrganization,
                errors: validationErrors,
                organization: isValidOrganization ? organization : null
              };

              // If organization is invalid and we're not already on onboarding
              if (!isValidOrganization && !location.pathname.includes('/onboarding')) {
                // Clean up localStorage and sessionStorage before redirect
                localStorage.removeItem('tempOrganizationData');
                sessionStorage.removeItem('organizationValidationState');
                
                // Store current state for potential recovery
                const recoveryState = {
                  path: location.pathname,
                  search: location.search,
                  state: location.state,
                  timestamp: Date.now(),
                  validationAttempt: (location.state?.validationAttempt || 0) + 1
                };
                
                // Prevent infinite redirect loops
                if (recoveryState.validationAttempt > 3) {
                  throw new Error('Maximum organization validation attempts exceeded');
                }
                
                sessionStorage.setItem('organizationValidationState', JSON.stringify(recoveryState));
                
                // Redirect with state to prevent loops
                navigate('/corporate/onboarding', {
                  state: { 
                    from: location.pathname,
                    requiresOrganization: true,
                    validationError: 'invalid_organization_data',
                    validationAttempt: recoveryState.validationAttempt
                  },
                  replace: true
                });
                return;
              }

              // Additional validation and refresh for organization data
              if (isValidOrganization) {
                    // Check if organization data needs refresh
                    const lastUpdated = organization?.lastUpdated as number | undefined;
                    const refreshInterval = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
                    
                    if (!lastUpdated || Date.now() - lastUpdated > refreshInterval) {
                  try {
                    // Get session token with explicit expiration and validation
                    const sessionToken = await session?.getToken({
                      leewayInSeconds: 120, // 2 minute leeway
                      template: 'organization_validation',
                      skipCache: true // Ensure fresh token
                    });
                    if (!sessionToken) {
                      throw new Error('Session token is required');
                    }
                    
                    if (!sessionToken) {
                      throw new Error('Failed to get valid session token');
                    }

                    // Validate token structure and expiration
                    const tokenParts = sessionToken.split('.');
                    if (tokenParts.length !== 3) {
                      throw new Error('Invalid session token format');
                    }

                    let tokenPayload: { exp: number };
                    try {
                      const payload = JSON.parse(atob(tokenParts[1]));
                      if (!payload?.exp || typeof payload.exp !== 'number') {
                        throw new Error('Invalid token payload');
                      }
                      tokenPayload = { exp: payload.exp };
                    } catch (error) {
                      throw new Error('Failed to parse token payload');
                    }
                    const expirationBuffer = 5 * 60 * 1000; // 5 minute buffer
                    if (Date.now() + expirationBuffer >= tokenPayload.exp * 1000) {
                      throw new Error('Session token near expiration');
                    }

                    // Attempt to refresh organization data with validation
                    if (!organization?.id) {
                      throw new Error('Organization ID is required');
                    }
                    
                    const orgId = organization.id;
                    if (typeof orgId !== 'string' || orgId.length === 0) {
                      throw new Error('Invalid organization ID');
                    }

                    // Validate organization ID format
                    if (!/^org_[a-zA-Z0-9]{24}$/.test(orgId)) {
                      throw new Error('Malformed organization ID');
                    }
                    
                    // Check if we have cached organization data
                    const cachedOrg = sessionStorage.getItem(`org_${orgId}`);
                    let updatedOrg: OrganizationDetails | null = null;
                    
                    if (cachedOrg && typeof cachedOrg === 'string') {
                      try {
                        const parsedOrg = JSON.parse(cachedOrg);
                        // Validate cached data
                        if (parsedOrg?.id === orgId && 
                            parsedOrg?.name &&
                            Date.now() - (parsedOrg.cachedAt || 0) < 5 * 60 * 1000) { // 5 minute cache
                          updatedOrg = parsedOrg;
                        } else {
                          sessionStorage.removeItem(`org_${orgId}`);
                        }
                      } catch (error) {
                        console.error('Failed to parse cached organization data:', error);
                        sessionStorage.removeItem(`org_${orgId}`);
                      }
                    }

                    if (!updatedOrg) {
                      if (!sessionToken) {
                        throw new Error('Session token is required');
                      }
                      
                      if (!orgId) {
                        throw new Error('Organization ID is required');
                      }
                      
                      if (!organization) {
                        throw new Error('Organization metadata is required');
                      }
                      
                      if (typeof orgId !== 'string') {
                        throw new Error('Invalid organization ID type');
                      }
                      
                      const fetchedOrg = await fetchOrganizationDetails(orgId, sessionToken);
                      if (!fetchedOrg?.id || !fetchedOrg?.name) {
                        throw new Error('Invalid organization data received');
                      }
                      updatedOrg = fetchedOrg;

                      // Cache the organization data
                      sessionStorage.setItem(`org_${orgId}`, JSON.stringify({
                        ...updatedOrg,
                        cachedAt: Date.now()
                      }));
                    }

                    // Update user metadata with refreshed organization data
                    if (!user?.update) {
                      throw new Error('User update method is not available');
                    }
                    
                    await user.update({
                      unsafeMetadata: {
                        ...user.unsafeMetadata,
                        currentOrganization: {
                          ...updatedOrg,
                          lastUpdated: Date.now(),
                          validatedAt: Date.now()
                        }
                      }
                    });
                    
                    // Reload session to ensure consistency
                    await session?.reload();
                  } catch (error) {
                    console.error('Organization refresh failed:', error instanceof Error ? error.message : 'Unknown error');
                    
                    // Store error details for debugging
                    const errorDetails = {
                      error: error instanceof Error ? error.message : 'Unknown error',
                      timestamp: Date.now(),
                      organizationId: organization?.id || 'unknown'
                    };
                    
                    sessionStorage.setItem('organizationRefreshError', JSON.stringify(errorDetails));
                    
                    // Redirect to onboarding with detailed error state
                    navigate('/corporate/onboarding', {
                      state: { 
                        from: location.pathname,
                        error: 'organization_refresh_failed',
                        organizationId: organization.id,
                        errorDetails: errorDetails
                      },
                      replace: true
                    });
                    return;
                  }
                }
              }
            } catch (error) {
              if (error instanceof Error) {
                console.error('Organization validation error:', error.message);
                // Attempt recovery by redirecting to onboarding
                navigate('/corporate/onboarding', {
                  state: { 
                    from: location.pathname,
                    error: 'organization_validation_failed',
                    message: error.message
                  },
                  replace: true
                });
              } else {
                console.error('Unknown organization validation error');
                navigate('/corporate/onboarding', {
                  state: { 
                    from: location.pathname,
                    error: 'organization_validation_failed',
                    message: 'Unknown error'
                  },
                  replace: true
                });
              }
              return;
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Authentication middleware error:', errorMessage);
        // Redirect to error page with state
        // Enhanced error handling with security headers
        const errorResponse = new Response(null, {
          status: 302,
          headers: new Headers({
            Location: '/error',
            ...SECURITY_HEADERS
          })
        });
        
        // Apply security headers and redirect
        applySecurityHeaders(errorResponse);
        
        navigate('/error', {
          state: {
            error: 'auth_middleware_failure',
            message: errorMessage,
            timestamp: Date.now(),
            path: location.pathname,
            securityHeaders: SECURITY_HEADERS
          },
          replace: true
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuth();
  }, [
    isLoaded, 
    isSignedIn, 
    user, 
    location,
    navigate, 
    requireAuth, 
    requireOnboarding, 
    allowedUserTypes, 
    requireOrganization, 
    session,
    isProcessing
  ]);

  const needsOnboarding = requireOnboarding && 
    isSignedIn && 
    user?.unsafeMetadata?.onboardingComplete === false;

  return {
    isLoaded,
    isSignedIn,
    user,
    session,
    needsOnboarding
  };
}

// Helper hook for protected routes
export function useProtectedRoute(options: UseAuthMiddlewareProps = {}) {
  const defaultOptions = {
    requireAuth: true,
    requireOnboarding: true,
    ...options,
  };

  return useAuthMiddleware(defaultOptions);
}

// Helper hook for public routes
export function usePublicRoute() {
  return useAuthMiddleware();
}

// Helper hook for retail routes
export function useRetailRoute(requireOnboarding = true) {
  return useAuthMiddleware({
    requireAuth: true,
    requireOnboarding,
    allowedUserTypes: ['retail'],
  });
}

// Helper hook for corporate routes
export function useCorporateRoute(requireOnboarding = true, requireOrganization = true) {
  return useAuthMiddleware({
    requireAuth: true,
    requireOnboarding,
    allowedUserTypes: ['corporate'],
    requireOrganization,
  });
}
