import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioButtonProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  value,
  onChange,
  name,
  label,
  disabled = false,
  error,
  required = false,
  className = '',
  labelClassName = '',
  orientation = 'vertical',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${className}`}>
      {label && (
        <div className={`mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      <div className={`
        ${orientation === 'horizontal' ? 'flex flex-wrap gap-x-4' : 'space-y-2'}
      `}>
        {options.map((option) => {
          const radioId = `radio-${name}-${option.value}`;
          
          return (
            <div key={option.value} className="flex items-center">
              <input
                id={radioId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                className={`
                  w-4 h-4
                  text-primary-600 dark:text-primary-500
                  border-gray-300 dark:border-gray-700
                  focus:ring-primary-500 dark:focus:ring-primary-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${error ? 'border-red-500' : ''}
                `}
                aria-invalid={error ? 'true' : 'false'}
              />
              <label
                htmlFor={radioId}
                className={`
                  ml-2 text-sm font-medium text-gray-700 dark:text-gray-300
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
};

export default RadioButton;
