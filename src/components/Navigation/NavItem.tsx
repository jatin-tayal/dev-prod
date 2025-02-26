import React from 'react';
import { Link } from 'react-router-dom';
import { NavItemProps } from 'types';
import { getIconComponent } from 'utils/icons';

const NavItem: React.FC<NavItemProps> = ({ utility, isActive, onClick }) => {
  const Icon = utility.icon ? getIconComponent(utility.icon) : null;

  return (
    <Link
      to={utility.path}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {Icon && (
        <span className="mr-3 text-lg">
          <Icon className={`h-5 w-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
        </span>
      )}
      {utility.name}
    </Link>
  );
};

export default NavItem;
