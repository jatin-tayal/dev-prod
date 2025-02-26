import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarProps } from 'types';

// This is a placeholder for the utility categories
const CATEGORIES = [
  {
    id: 'json',
    name: 'JSON Utilities',
    utilities: [
      { id: 'json-formatter', name: 'JSON Formatter', path: '/utilities/json-formatter' }
    ]
  },
  {
    id: 'string',
    name: 'String Manipulation',
    utilities: [
      { id: 'base64', name: 'Base64 Encoder/Decoder', path: '/utilities/base64' }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-semibold text-primary-600">DevUtils</span>
          <button
            type="button"
            className="md:hidden rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
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
        <nav className="px-2 py-4 h-[calc(100%-4rem)] overflow-y-auto">
          <Link 
            to="/" 
            className="flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-600 hover:bg-gray-100"
            onClick={onClose}
          >
            <svg
              className="mr-3 h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          
          <div className="mt-4">
            {CATEGORIES.map((category) => (
              <div key={category.id} className="mb-4">
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {category.name}
                </h3>
                <div className="space-y-1">
                  {category.utilities.map((utility) => (
                    <Link
                      key={utility.id}
                      to={utility.path}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
                      onClick={onClose}
                    >
                      {utility.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;