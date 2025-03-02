import React from "react";

export interface ErrorMessageProps {
  message: string;
  className?: string;
  showIcon?: boolean;
  onDismiss?: () => void;
  dismissable?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
  showIcon = true,
  onDismiss,
  dismissable = false,
}) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-start p-4 mb-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 ${className}`}
      role="alert"
    >
      {showIcon && (
        <div className="flex-shrink-0 mr-3">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="flex-1 text-sm text-red-700 dark:text-red-400">
        {message}
      </div>
      {dismissable && onDismiss && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-red-50 dark:bg-transparent text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 inline-flex h-8 w-8 items-center justify-center"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
