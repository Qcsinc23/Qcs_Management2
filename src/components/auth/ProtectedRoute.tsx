import { RedirectToSignIn, useAuth, useClerk } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoggingService } from '../../services/LoggingService'
import SecureStorageService from '../../services/SecureStorageService'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// List of allowed redirect URLs
const ALLOWED_REDIRECT_URLS = ['/landing', '/signin']

const isValidRedirectUrl = (url: string): boolean => {
  return ALLOWED_REDIRECT_URLS.includes(url)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const logger = LoggingService.getInstance()
  const secureStorage = SecureStorageService.getInstance()

  useEffect(() => {
    // Clean up session data on unmount
    return () => {
      if (!isSignedIn) {
        secureStorage.clear()
      }
    }
  }, [isSignedIn])

  const handleSignOut = async () => {
    try {
      await signOut()
      secureStorage.clear()
      const redirectUrl = '/landing'
      if (isValidRedirectUrl(redirectUrl)) {
        navigate(redirectUrl)
      } else {
        logger.error('Invalid redirect URL detected')
        navigate('/landing')
      }
    } catch (error) {
      logger.error('Error during sign out:', error)
      navigate('/landing')
    }
  }

  // Handle the loading state
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // If the user is not signed in, redirect to the sign-in page
  if (!isSignedIn) {
    logger.info('Unauthorized access attempt, redirecting to sign in')
    return <RedirectToSignIn afterSignInUrl={window.location.pathname} />
  }

  // If the user is signed in, render the protected content
  return <>{children}</>
}

export default ProtectedRoute
