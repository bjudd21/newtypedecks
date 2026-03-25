/**
 * Default error boundary fallback UI
 */

import React from 'react';

interface ErrorBoundaryFallbackProps {
  error: Error;
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
}) => {
  return (
    <div className="bg-accent flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-foreground text-sm font-medium">
              Something went wrong
            </h3>
            <div className="text-muted-foreground/70 mt-2 text-sm">
              <p>
                We&apos;re sorry, but something unexpected happened. The error
                has been reported and we&apos;re working to fix it.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4">
            <summary className="text-muted-foreground cursor-pointer text-sm">
              Error details (development only)
            </summary>
            <pre className="text-muted-foreground/70 mt-2 overflow-auto text-xs">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
