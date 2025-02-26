import React from 'react';

export interface SuccessMessageProps {
  message: string;
  className?: string;
  showIcon?: boolean;
  onDismiss?: () => void;
  dismissable?: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className = '',
  showIcon = true,
  onDismiss,
  dismissable = false,
}) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-start p-4 mb-4 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 ${className}`}
      role="alert"
    >
      {showIcon && (
        <div className="flex-shrink-0 mr-3">
          <svg
            className="h-5 w-5 text-green-600 dark:text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="flex-1 text-sm text-green-700 dark:text-green-400">
        {message}
      </div>
      {dismissable && onDismiss && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-green-50 dark:bg-transparent text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex h-8 w-8 items-center justify-center"
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

export default SuccessMessage;