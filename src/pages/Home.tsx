import React from 'react';
import { Link } from 'react-router-dom';
import utilitiesConfig from 'config/utilities';

// Get the first utility from each category for the featured section
const FEATURED_UTILITIES = utilitiesConfig
  .map(category => category.utilities[0])
  .slice(0, 6); // Limit to 6 utilities

const Home: React.FC = () => {
  return (
    <div className="py-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Developer Utilities</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A collection of useful tools for developers to streamline your workflow.
          All utilities run in your browser - no data is sent to any server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_UTILITIES.map((utility) => (
          <Link
            key={utility.id}
            to={utility.path}
            className="card hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 shadow-md p-6 rounded-lg dark:text-white"
          >
            <div className="text-4xl font-mono mb-4 text-primary-500">{utility.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{utility.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{utility.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">More Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We're constantly adding new utilities to help make your development workflow
          more efficient. Check back soon for more tools!
        </p>
      </div>
    </div>
  );
};

export default Home;