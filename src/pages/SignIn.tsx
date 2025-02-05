import { SignIn as ClerkSignIn, useAuth } from '@clerk/clerk-react'
import React from 'react'
import { Navigate } from 'react-router-dom'

const SignIn: React.FC = () => {
  const { isSignedIn } = useAuth()

  // If user is already signed in, redirect to dashboard
  if (isSignedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1>Welcome to QCS Management</h1>
        <p>Please sign in to access your dashboard</p>

        <div className="clerk-signin">
          <ClerkSignIn
            routing="path"
            path="/signin"
            signUpUrl="/signup"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        </div>

        <div className="signin-footer">
          <p>© 2025 QCS Management. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
