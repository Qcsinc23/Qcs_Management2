import React from 'react'
import { Link } from 'react-router-dom'

interface ServerErrorProps {
  error?: Error
}

const ServerError: React.FC<ServerErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            500 - Server Error
          </h1>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. Please try again later.
          </p>
          {error && import.meta.env.DEV && (
            <details className="mt-2 text-red-600 text-sm">
              <summary>Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServerError
