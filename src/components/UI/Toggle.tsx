import React from 'react';

export interface ToggleProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  className?: string;
  labelClassName?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  isChecked,
  onChange,
  label,
  id,
  disabled = false,
  size = 'md',
  name,
  className = '',
  labelClassName = '',
}) => {
  // Generate a unique ID if none provided
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  // Size-based classes
  const sizes = {
    sm: {
      toggle: 'w-9 h-5',
      dot: 'h-3 w-3',
      translateX: 'translate-x-4',
    },
    md: {
      toggle: 'w-11 h-6',
      dot: 'h-4 w-4',
      translateX: 'translate-x-5',
    },
    lg: {
      toggle: 'w-14 h-7',
      dot: 'h-5 w-5',
      translateX: 'translate-x-7',
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative inline-block">
        <input
          type="checkbox"
          id={toggleId}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={toggleId}
          className={`
            block cursor-pointer rounded-full 
            ${sizes[size].toggle}
            ${
              isChecked
                ? 'bg-primary-600 dark:bg-primary-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            transition-colors duration-200
          `}
        >
          <span
            className={`
              absolute rounded-full bg-white dark:bg-gray-200
              top-0.5 left-0.5
              transition-transform duration-200
              ${sizes[size].dot}
              ${isChecked ? sizes[size].translateX : 'translate-x-0'}
              ${disabled ? 'opacity-75' : ''}
            `}
          />
        </label>
      </div>
      {label && (
        <span
          className={`ml-2 text-gray-700 dark:text-gray-300 ${
            disabled ? 'opacity-50' : ''
          } ${labelClassName}`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
