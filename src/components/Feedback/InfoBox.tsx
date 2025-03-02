import React, { useState } from "react";

export interface InfoBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  initiallyExpanded?: boolean;
  collapsible?: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  children,
  className = "",
  initiallyExpanded = true,
  collapsible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`rounded-md overflow-hidden bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 ${className}`}
    >
      {title && (
        <div
          className={`
            flex justify-between items-center px-4 py-3 
            bg-blue-100 dark:bg-blue-900/40 border-b border-blue-200 dark:border-blue-800
            ${collapsible ? "cursor-pointer" : ""}
          `}
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          <h3 className="text-base font-medium text-blue-800 dark:text-blue-300">
            {title}
          </h3>
          {collapsible && (
            <button
              type="button"
              className="focus:outline-none"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <svg
                className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${
                  isExpanded ? "transform rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
      <div
        className={`px-4 py-3 text-sm text-blue-700 dark:text-blue-300 transition-all overflow-hidden ${
          isExpanded ? "max-h-screen" : "max-h-0 py-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default InfoBox;
