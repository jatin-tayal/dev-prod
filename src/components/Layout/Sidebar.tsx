import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProps } from "types";
import { SearchBox } from "components/Navigation";
import { CategoryGroup } from "components/Navigation";
import { HomeIcon } from "utils/icons";
import utilitiesConfig from "config/utilities";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter categories and utilities based on search
  const filteredCategories = utilitiesConfig
    .map((category) => {
      // Filter utilities in this category
      const filteredUtilities = category.utilities.filter((utility) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          utility.name.toLowerCase().includes(lowerSearchTerm) ||
          utility.description.toLowerCase().includes(lowerSearchTerm)
        );
      });

      // Return category with filtered utilities
      return {
        ...category,
        utilities: filteredUtilities,
      };
    })
    // Only keep categories that have utilities after filtering
    .filter((category) => category.utilities.length > 0);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
          role="presentation"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform md:translate-x-0 md:static md:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            DevProd
          </span>
          <button
            type="button"
            className="md:hidden rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search utilities..."
          />
        </div>

        <nav className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center px-3 py-2 mb-4 text-base font-medium rounded-md transition-colors ${
              location.pathname === "/"
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            onClick={onClose}
          >
            <HomeIcon className="mr-3 h-5 w-5" />
            Home
          </Link>

          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <CategoryGroup
                key={category.id}
                category={category}
                activePath={location.pathname}
                onNavItemClick={onClose}
              />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
