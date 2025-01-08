import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface ErrorState {
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

const ServerError: React.FC = () => {
  const location = useLocation();
  const state = location.state as ErrorState;

  useEffect(() => {
    if (state?.error) {
      console.error('Server Error:', state.error);
      console.error('Error Info:', state.errorInfo);
      
      // Log error to error tracking service
      try {
        // TODO: Add error tracking service integration
        // logErrorToService(state.error, state.errorInfo);
      } catch (loggingError) {
        console.error('Failed to log error:', loggingError);
      }
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Server Error</h2>
        
        <div className="mb-8 space-y-4">
          <p className="text-gray-600">
            We're experiencing some technical difficulties. Please try again later.
          </p>
          
          {state?.error && (
            <div className="bg-red-50 p-4 rounded-md text-left">
              <h3 className="font-medium text-red-700">Error Details</h3>
              <p className="text-red-600 text-sm mt-1">{state.error.message}</p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2 text-red-600 text-sm">
                  <summary>Stack Trace</summary>
                  <pre className="mt-2 overflow-auto">
                    {state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh Page
          </button>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          If the problem persists, please contact support at{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
            support@example.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
