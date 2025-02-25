import React from 'react';
import { MainProps } from 'types';

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default Main;
