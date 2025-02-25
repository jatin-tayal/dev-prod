import React from 'react';
import { Link } from 'react-router-dom';

// Featured utilities for the homepage
const FEATURED_UTILITIES = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate your JSON data with syntax highlighting',
    path: '/utilities/json-formatter',
    icon: '{ }',
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode or decode Base64 strings with ease',
    path: '/utilities/base64',
    icon: '64',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens',
    path: '/utilities/jwt-decoder',
    icon: 'JWT',
  },
];

const Home: React.FC = () => {
  return (
    <div className="py-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Developer Utilities</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A collection of useful tools for developers to streamline your workflow.
          All utilities run in your browser - no data is sent to any server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_UTILITIES.map((utility) => (
          <Link
            key={utility.id}
            to={utility.path}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl font-mono mb-4 text-primary-500">{utility.icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{utility.name}</h2>
            <p className="text-gray-600">{utility.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">More Coming Soon</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're constantly adding new utilities to help make your development workflow
          more efficient. Check back soon for more tools!
        </p>
      </div>
    </div>
  );
};

export default Home;
