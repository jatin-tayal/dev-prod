import React, { useState } from "react";
import { InfoBox } from "../Feedback";
import { Button } from "../UI";
import { useMediaQuery } from "../../hooks";

export interface UtilityPageProps {
  title: string;
  description?: string;
  helpContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  initialHelpExpanded?: boolean;
}

const UtilityPage: React.FC<UtilityPageProps> = ({
  title,
  description,
  helpContent,
  children,
  className = "",
  actions,
  initialHelpExpanded = false,
}) => {
  const [isHelpExpanded, setIsHelpExpanded] = useState(initialHelpExpanded);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleHelp = () => {
    setIsHelpExpanded(!isHelpExpanded);
  };

  return (
    <div className={`max-w-6xl mx-auto py-6 px-4 sm:px-6 ${className}`}>
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {helpContent && (
              <Button
                variant="secondary"
                onClick={toggleHelp}
                aria-expanded={isHelpExpanded}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                {isHelpExpanded ? "Hide Help" : "Show Help"}
              </Button>
            )}
            {actions}
          </div>
        </div>
      </div>

      {helpContent && isHelpExpanded && (
        <div className="mb-6">
          <InfoBox title="Help & Instructions">{helpContent}</InfoBox>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-4 sm:p-6 mb-8">
        {children}
      </div>
    </div>
  );
};

export default UtilityPage;
