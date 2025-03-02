import React, { createContext, useContext, useState, ReactNode } from "react";
import ValidationError from "../utils/ValidationError";

export interface ErrorState {
  error: Error | null;
  message: string;
  field?: string;
  code?: string;
  timestamp: number;
}

interface ErrorContextType {
  error: ErrorState | null;
  setError: (error: Error | null, field?: string) => void;
  clearError: () => void;
  hasError: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [error, setErrorState] = useState<ErrorState | null>(null);

  const setError = (err: Error | null, field?: string) => {
    if (!err) {
      setErrorState(null);
      return;
    }

    const errorState: ErrorState = {
      error: err,
      message: err.message,
      timestamp: Date.now(),
    };

    if (err instanceof ValidationError) {
      errorState.field = err.field || field;
      errorState.code = err.code;
    } else {
      errorState.field = field;
    }

    setErrorState(errorState);

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error captured in ErrorContext:", err);
    }
  };

  const clearError = () => {
    setErrorState(null);
  };

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        clearError,
        hasError: error !== null,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

export default ErrorContext;
