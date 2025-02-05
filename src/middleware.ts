import type { OrganizationDetails } from './services/organization'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchOrganizationDetails } from './services/organization'

// Generate a random nonce
export function generateNonce() {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Store the current nonce
let currentNonce = generateNonce()

// Function to get the current nonce
export function getCurrentNonce() {
  return currentNonce
}

// Function to refresh the nonce
export function refreshNonce() {
  currentNonce = generateNonce()
  return currentNonce
}

// Enhanced CSP configuration for Clerk with additional security headers
export function getSecurityHeaders() {
  return {
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
      style-src 'self' 'unsafe-inline' 'nonce-${currentNonce}' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com https://accounts.clerk.com https://fonts.googleapis.com https://js.stripe.com https://*.mui.com;
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
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  }
}

// Export security headers for server-side use
export const SECURITY_HEADERS = getSecurityHeaders()

// Apply security headers to all responses
export function applySecurityHeaders(response: Response) {
  const headers = getSecurityHeaders()
  const newHeaders = new Headers(response.headers)

  // Add security headers to the new Headers object
  Object.entries(headers).forEach(([header, value]) => {
    newHeaders.set(header, value)
  })

  // Create a new Response with the modified headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}

interface OrganizationMetadata {
  id: string
  name: string
  lastUpdated?: number
  [key: string]: unknown
}

interface UseAuthMiddlewareProps {
  requireAuth?: boolean
  requireOnboarding?: boolean
  allowedUserTypes?: Array<'retail' | 'corporate'>
  requireOrganization?: boolean
}

// Helper function to validate organization
function validateOrganization(organization: unknown): organization is OrganizationMetadata {
  if (!organization || typeof organization !== 'object')
    return false
  const org = organization as Record<string, unknown>
  return (
    typeof org.id === 'string'
    && org.id.length > 0
    && typeof org.name === 'string'
    && org.name.length > 0
    && (org.lastUpdated === undefined || typeof org.lastUpdated === 'number')
  )
}

// Helper function to validate session token
async function validateSessionToken(session: ReturnType<typeof useClerk>['session']) {
  const token = await session?.getToken({
    leewayInSeconds: 120,
    template: 'organization_validation',
    skipCache: true,
  })

  if (!token)
    throw new Error('Failed to get valid session token')
  return token
}

// Helper function to validate and parse organization from cache
function parseOrganizationCache(cachedData: string | null, orgId: string): OrganizationDetails | null {
  if (!cachedData)
    return null
  try {
    const parsed = JSON.parse(cachedData)
    if (
      parsed?.id === orgId
      && parsed?.name
      && Date.now() - (parsed.cachedAt || 0) < 5 * 60 * 1000
    ) {
      return parsed
    }
  }
  catch {
    return null
  }
  return null
}

export function useAuthMiddleware({
  requireAuth = false,
  requireOnboarding = false,
  allowedUserTypes = [],
  requireOrganization = false,
}: UseAuthMiddlewareProps = {}) {
  const { isLoaded, isSignedIn, user } = useUser()
  const { session } = useClerk()
  const navigate = useNavigate()
  const location = useLocation()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    if (!isLoaded)
      return

    const handleAuth = async () => {
      if (isProcessing)
        return
      setIsProcessing(true)

      try {
        // If authentication is required and user is not signed in
        if (requireAuth && !isSignedIn) {
          const searchParams = new URLSearchParams()
          searchParams.set('redirect_url', location.pathname + location.search)

          // Get user type from URL path or localStorage
          let userType = location.pathname.split('/')[1]
          if (userType !== 'retail' && userType !== 'corporate') {
            userType = localStorage.getItem('userType') || ''
          }

          if (userType) {
            searchParams.set('userType', userType)
            localStorage.setItem('userType', userType)
          }

          // Store current state in session storage
          sessionStorage.setItem('preAuthState', JSON.stringify({
            path: location.pathname,
            search: location.search,
            state: location.state,
          }))

          navigate(`/sign-in?${searchParams.toString()}`)
          return
        }

        // Restore pre-auth state if available
        const preAuthState = sessionStorage.getItem('preAuthState')
        if (preAuthState && isSignedIn) {
          const { path, search, state } = JSON.parse(preAuthState)
          sessionStorage.removeItem('preAuthState')

          // Only restore if the current path is the sign-in page
          if (location.pathname === '/sign-in') {
            navigate(path + search, { state, replace: true })
            return
          }
        }

        // If user is signed in, check additional requirements
        if (isSignedIn && user) {
          // Validate session state
          if (!session) {
            throw new Error('Session is not available')
          }

          // Debug user metadata state
          console.log('User Metadata State:', {
            hasMetadata: !!user.unsafeMetadata,
            metadataType: typeof user.unsafeMetadata,
            metadata: user.unsafeMetadata,
          })

          // Ensure metadata exists with proper typing
          if (!user.unsafeMetadata || typeof user.unsafeMetadata !== 'object') {
            console.log('Initializing user metadata...')
            try {
              const updateResult = await user.update({
                unsafeMetadata: {
                  userType: '',
                  onboardingComplete: false,
                  currentOrganization: null,
                  metadataVersion: 1,
                  onboardingCompletedAt: null,
                },
              })
              console.log('Metadata update result:', updateResult)

              await session.reload()
              console.log('Session reloaded after metadata init')
              return // Allow useEffect to trigger again with updated metadata
            }
            catch (error) {
              console.error('Failed to initialize metadata:', error)
              throw error
            }
          }

          // Extract and validate user type and onboarding status
          const userType = user.unsafeMetadata.userType as string | undefined
          const onboardingComplete = user.unsafeMetadata.onboardingComplete as boolean | undefined

          console.log('User Status:', {
            userType,
            onboardingComplete,
            allowedTypes: allowedUserTypes,
            requiresOnboarding: requireOnboarding,
            currentPath: location.pathname,
          })

          // Check if user type is allowed
          if (allowedUserTypes.length > 0) {
          // If user doesn't have a type yet, check localStorage and URL path
            if (!userType) {
              const storedType = localStorage.getItem('userType')
              const pathType = location.pathname.split('/')[1]

              // Determine type from most reliable source - prioritize path over stored type
              // This ensures the user's selected type during sign-in takes precedence
              const determinedType
              = allowedUserTypes.includes(pathType as 'retail' | 'corporate')
                ? pathType
                : storedType && allowedUserTypes.includes(storedType as 'retail' | 'corporate')
                  ? storedType
                  : null

              if (determinedType) {
                await user.update({
                  unsafeMetadata: {
                    ...user.unsafeMetadata,
                    userType: determinedType,
                    onboardingComplete: false,
                    onboardingCompletedAt: null,
                  },
                })
                await session?.reload()

                // Store type in localStorage for consistency
                localStorage.setItem('userType', determinedType)

                // Redirect to onboarding with proper state
                navigate(`/${determinedType}/onboarding`, {
                  state: {
                    from: location.pathname,
                    requiresOnboarding: true,
                    userType: determinedType,
                  },
                  replace: true,
                })
                return
              }
            }

            // If user has a type that's not allowed, redirect with proper state
            if (userType && !allowedUserTypes.includes(userType as 'retail' | 'corporate')) {
              navigate(`/${userType}`, {
                state: {
                  from: location.pathname,
                  restricted: true,
                  allowedTypes: allowedUserTypes,
                  currentType: userType,
                },
                replace: true,
              })
              return
            }
          }

          // Check if onboarding is required with proper state
          if (requireOnboarding && !onboardingComplete && !location.pathname.includes('/onboarding')) {
            navigate(`/${userType}/onboarding`, {
              state: {
                from: location.pathname,
                requiresOnboarding: true,
                userType,
              },
              replace: true,
            })
            return
          }

          // Check if organization is required (for corporate users)
          // Skip organization check for the first 5 minutes after onboarding completion
          const onboardingCompletionTime = user.unsafeMetadata?.onboardingCompletedAt as number
          const isInGracePeriod = onboardingCompletionTime && Date.now() - onboardingCompletionTime < 5 * 60 * 1000

          // Only check organization requirement if explicitly required and user is corporate
          if (requireOrganization && userType === 'corporate' && onboardingComplete && !isInGracePeriod && !location.pathname.includes('/onboarding')) {
            try {
              const orgData = user?.unsafeMetadata?.currentOrganization
              if (!validateOrganization(orgData)) {
                throw new Error('Invalid organization data')
              }

              const organization = orgData
              const lastUpdated = organization.lastUpdated ?? 0
              const refreshInterval = 12 * 60 * 60 * 1000

              if (Date.now() - lastUpdated > refreshInterval) {
                const cachedOrg = parseOrganizationCache(
                  sessionStorage.getItem(`org_${organization.id}`),
                  organization.id,
                )

                let updatedOrg: OrganizationDetails
                if (cachedOrg) {
                  updatedOrg = cachedOrg
                }
                else {
                  const fetchedOrg = await fetchOrganizationDetails(organization.id)
                  if (!fetchedOrg?.id || !fetchedOrg?.name) {
                    throw new Error('Invalid organization data received')
                  }
                  updatedOrg = fetchedOrg
                  sessionStorage.setItem(
                    `org_${organization.id}`,
                    JSON.stringify({ ...updatedOrg, cachedAt: Date.now() }),
                  )
                }

                await user.update({
                  unsafeMetadata: {
                    ...user.unsafeMetadata,
                    currentOrganization: {
                      ...updatedOrg,
                      lastUpdated: Date.now(),
                      validatedAt: Date.now(),
                    },
                  },
                })

                await session?.reload()
              }
            }
            catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              console.error('Organization validation error:', errorMessage)
              navigate('/corporate/onboarding', {
                state: {
                  from: location.pathname,
                  error: 'organization_validation_failed',
                  message: errorMessage,
                },
                replace: true,
              })
            }
          }
        }
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Authentication middleware error:', errorMessage)

        // Redirect to error page with state
        navigate('/error', {
          state: {
            error: 'auth_middleware_failure',
            message: errorMessage,
            timestamp: Date.now(),
            path: location.pathname,
            securityHeaders: SECURITY_HEADERS,
          },
          replace: true,
        })
      }
      finally {
        setIsProcessing(false)
      }
    }

    handleAuth()
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
    isProcessing,
  ])

  const needsOnboarding = requireOnboarding
    && isSignedIn
    && user?.unsafeMetadata?.onboardingComplete === false

  return {
    isLoaded,
    isSignedIn,
    user,
    session,
    needsOnboarding,
  }
}

// Helper hook for protected routes
export function useProtectedRoute(options: UseAuthMiddlewareProps = {}) {
  const defaultOptions = {
    requireAuth: true,
    requireOnboarding: true,
    ...options,
  }

  return useAuthMiddleware(defaultOptions)
}

// Helper hook for public routes
export function usePublicRoute() {
  return useAuthMiddleware()
}

// Helper hook for retail routes
export function useRetailRoute(requireOnboarding = true) {
  return useAuthMiddleware({
    requireAuth: true,
    requireOnboarding,
    allowedUserTypes: ['retail'],
  })
}

// Helper hook for corporate routes
export function useCorporateRoute(requireOnboarding = true, requireOrganization = true) {
  return useAuthMiddleware({
    requireAuth: true,
    requireOnboarding,
    allowedUserTypes: ['corporate'],
    requireOrganization,
  })
}
