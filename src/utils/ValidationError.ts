/**
 * Custom error class for validation errors
 * Extends the standard Error class with field-specific validation
 */
export class ValidationError extends Error {
  public field?: string;
  public code?: string;
  
  constructor(message: string, field?: string, code?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    
    // This is necessary for instanceof to work correctly
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Helper function to create a new ValidationError
 */
export function createValidationError(
  message: string,
  field?: string,
  code?: string
): ValidationError {
  return new ValidationError(message, field, code);
}

/**
 * Interface for field validation
 */
export interface FieldValidator<T> {
  (value: T): void | ValidationError | Promise<void | ValidationError>;
}

/**
 * Utility function to validate a field with an array of validators
 */
export async function validateField<T>(
  value: T,
  validators: FieldValidator<T>[]
): Promise<ValidationError | null> {
  for (const validator of validators) {
    try {
      const result = await validator(value);
      if (result instanceof ValidationError) {
        return result;
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return error;
      }
      throw error;
    }
  }
  return null;
}

/**
 * Common validators
 */
export const validators = {
  required: <T>(fieldName: string = 'This field') => 
    (value: T): void | ValidationError => {
      // Check for empty string, null, undefined
      if (
        value === undefined || 
        value === null || 
        (typeof value === 'string' && value.trim() === '')
      ) {
        return new ValidationError(
          `${fieldName} is required`,
          fieldName,
          'required'
        );
      }
    },
  
  minLength: (min: number, fieldName: string = 'This field') => 
    (value: string): void | ValidationError => {
      if (typeof value === 'string' && value.length < min) {
        return new ValidationError(
          `${fieldName} must be at least ${min} characters`,
          fieldName,
          'minLength'
        );
      }
    },
  
  maxLength: (max: number, fieldName: string = 'This field') => 
    (value: string): void | ValidationError => {
      if (typeof value === 'string' && value.length > max) {
        return new ValidationError(
          `${fieldName} must be no more than ${max} characters`,
          fieldName,
          'maxLength'
        );
      }
    },
  
  pattern: (regex: RegExp, message: string, fieldName?: string) => 
    (value: string): void | ValidationError => {
      if (typeof value === 'string' && !regex.test(value)) {
        return new ValidationError(
          message,
          fieldName,
          'pattern'
        );
      }
    },
  
  // Add more validators as needed
  isValidJson: (fieldName: string = 'JSON') => 
    (value: string): void | ValidationError => {
      if (!value.trim()) return;
      
      try {
        JSON.parse(value);
      } catch (error) {
        return new ValidationError(
          `Invalid JSON: ${(error as Error).message}`,
          fieldName,
          'json'
        );
      }
    }
};

export default ValidationError;
