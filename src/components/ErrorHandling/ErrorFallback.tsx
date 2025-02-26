import React from 'react';
import { Button } from '../UI';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo?: React.ErrorInfo | null;
  resetError?: () => void;
}

/**
 * Fallback UI displayed when an error is caught by ErrorBoundary
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  resetError 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We're sorry, but an error occurred while trying to render this page. Our team has been notified.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
            <p className="font-mono text-red-600 dark:text-red-400 text-sm mb-2">
              {error?.name}: {error?.message}
            </p>
            {isDevelopment && errorInfo && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Error Stack Trace
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto p-2">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {resetError && (
            <Button onClick={resetError} variant="primary">
              Try Again
            </Button>
          )}
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
          >
            Go to Home Page
          </Button>
          {isDevelopment && (
            <Button
              onClick={() => window.location.reload()}
              variant="tertiary"
            >
              Reload Page
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
