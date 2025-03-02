import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  id,
  name,
  placeholder,
  disabled = false,
  error,
  required = false,
  className = "",
  labelClassName = "",
  selectClassName = "",
}) => {
  // Generate a unique ID if none provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${
            required ? "required" : ""
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          block w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md shadow-sm
          border-gray-300 dark:border-gray-700
          focus:outline-none focus:ring-primary-500 focus:border-primary-500
          text-gray-900 dark:text-gray-100
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          dark:disabled:bg-gray-900 dark:disabled:text-gray-600
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }
          ${selectClassName}
        `}
        aria-invalid={error ? "true" : "false"}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Select;
