import React from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  name,
  disabled = false,
  required = false,
  error,
  className = "",
  labelClassName = "",
}) => {
  // Generate a unique ID if none provided
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`
            w-4 h-4 rounded 
            text-primary-600 dark:text-primary-500
            border-gray-300 dark:border-gray-700
            focus:ring-primary-500 dark:focus:ring-primary-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : ""}
          `}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      {label && (
        <div className="ml-2 text-sm">
          <label
            htmlFor={checkboxId}
            className={`
              font-medium text-gray-700 dark:text-gray-300
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${labelClassName}
            `}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
