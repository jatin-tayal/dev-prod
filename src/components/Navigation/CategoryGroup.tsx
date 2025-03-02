import React, { useState } from "react";
import { CategoryGroupProps } from "types";
import NavItem from "./NavItem";

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  activePath,
  onNavItemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if any utility in this category is active
  const hasActiveItem = category.utilities.some(
    (utility) => utility.path === activePath
  );

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 group"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <span>{category.name}</span>
        <svg
          className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-transform ${
            isExpanded ? "transform rotate-0" : "transform rotate-180"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className={`mt-1 space-y-1 ${isExpanded ? "block" : "hidden"}`}>
        {category.utilities.map((utility) => (
          <NavItem
            key={utility.id}
            utility={utility}
            isActive={utility.path === activePath}
            onClick={onNavItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
