import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="mt-6 btn btn-primary"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;