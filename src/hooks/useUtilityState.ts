import { useState, useCallback, useEffect, useRef } from "react";
import useQueryParams from "./useQueryParams";
import { useError } from "../context/ErrorContext";
import storage from "../utils/StorageUtils";
import ValidationError from "../utils/ValidationError";
import historyManager from "../utils/HistoryManager";
import analytics from "../utils/AnalyticsTracker";
import UrlStateManager from "../utils/UrlStateManager";

export interface UtilityStateOptions<T, R> {
  // Unique ID for the utility
  utilityId: string;

  // Display name for the utility
  utilityName: string;

  // Initial state values
  initialInput: T;
  initialOutput?: R;

  // Processing function
  processFunction?: (input: T) => Promise<R> | R;

  // Validation function
  validateInput?: (
    input: T
  ) => ValidationError | void | Promise<ValidationError | void>;

  // Persistence options
  persist?: boolean;
  persistInput?: boolean;
  persistOutput?: boolean;

  // URL state options
  syncWithUrl?: boolean;
  urlParamPrefix?: string;

  // Track utility usage
  trackUsage?: boolean;

  // Auto-process on input change (debounced)
  autoProcess?: boolean;
  autoProcessDelay?: number;
}

export interface UtilityState<T, R> {
  // State values
  input: T;
  output: R | undefined;
  isLoading: boolean;
  error: Error | null;

  // Actions
  setInput: (input: T | ((prev: T) => T)) => void;
  setOutput: (output: R | undefined) => void;
  process: () => Promise<R | undefined>;
  reset: () => void;
  clearOutput: () => void;
  clearError: () => void;

  // Utility
  getShareableUrl: () => string;
  copyShareableUrl: () => boolean;
}

/**
 * Custom hook for managing utility state consistently across all utilities
 */
function useUtilityState<T, R = any>(
  options: UtilityStateOptions<T, R>
): UtilityState<T, R> {
  const {
    utilityId,
    utilityName,
    initialInput,
    initialOutput,
    processFunction,
    validateInput,
    persist = true,
    persistInput = true,
    persistOutput = false,
    syncWithUrl = true,
    urlParamPrefix = "",
    trackUsage = true,
    autoProcess = false,
    autoProcessDelay = 1000,
  } = options;

  // Generate storage keys
  const inputStorageKey = `${utilityId}-input`;
  const outputStorageKey = `${utilityId}-output`;

  // Get error context
  const { setError: setContextError, clearError: clearContextError } =
    useError();

  // Load initial state from storage if available
  const getInitialInputFromStorage = () => {
    if (persist && persistInput) {
      const storedValue = storage.get<T>(inputStorageKey);
      return storedValue !== undefined ? storedValue : initialInput;
    }
    return initialInput;
  };

  const getInitialOutputFromStorage = () => {
    if (persist && persistOutput) {
      const storedValue = storage.get<R>(outputStorageKey);
      return storedValue !== undefined ? storedValue : initialOutput;
    }
    return initialOutput;
  };

  // Set up URL param sync
  const prefix = urlParamPrefix ? `${urlParamPrefix}-` : "";
  const [urlState, setUrlState] = useQueryParams<{
    [key: string]: any;
  }>(
    {
      [`${prefix}in`]: undefined,
      [`${prefix}out`]: undefined,
    },
    { replace: true }
  );

  // Get initial state from URL if available, otherwise use storage/defaults
  const getInitialInputFromUrl = () => {
    if (syncWithUrl && urlState[`${prefix}in`] !== undefined) {
      return urlState[`${prefix}in`] as unknown as T;
    }
    return getInitialInputFromStorage();
  };

  const getInitialOutputFromUrl = () => {
    if (syncWithUrl && urlState[`${prefix}out`] !== undefined) {
      return urlState[`${prefix}out`] as unknown as R;
    }
    return getInitialOutputFromStorage();
  };

  // Local state
  const [input, setInputState] = useState<T>(getInitialInputFromUrl());
  const [output, setOutputState] = useState<R | undefined>(
    getInitialOutputFromUrl()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<Error | null>(null);

  // Track if component is mounted for async safety
  const isMounted = useRef(true);

  // Timer for auto-process debouncing
  const autoProcessTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (autoProcessTimerRef.current) {
        clearTimeout(autoProcessTimerRef.current);
      }
    };
  }, []);

  // Set error in both local state and context
  const setError = useCallback(
    (err: Error | null) => {
      setLocalError(err);
      setContextError(err);
    },
    [setContextError]
  );

  // Clear error in both local state and context
  const clearError = useCallback(() => {
    setLocalError(null);
    clearContextError();
  }, [clearContextError]);

  // Set input with side effects (persistence, URL sync)
  const setInput = useCallback(
    (newInput: T | ((prev: T) => T)) => {
      setInputState((prev) => {
        const nextInput =
          typeof newInput === "function"
            ? (newInput as (prev: T) => T)(prev)
            : newInput;

        // Persist to localStorage if enabled
        if (persist && persistInput) {
          storage.set(inputStorageKey, nextInput);
        }

        // Sync to URL if enabled
        if (syncWithUrl) {
          setUrlState({ [`${prefix}in`]: nextInput });
        }

        // Schedule auto-processing if enabled
        if (autoProcess && processFunction) {
          if (autoProcessTimerRef.current) {
            clearTimeout(autoProcessTimerRef.current);
          }

          autoProcessTimerRef.current = setTimeout(() => {
            process();
            autoProcessTimerRef.current = null;
          }, autoProcessDelay);
        }

        return nextInput;
      });

      // Clear error when input changes
      clearError();
    },
    [
      persistInput,
      persist,
      inputStorageKey,
      syncWithUrl,
      setUrlState,
      prefix,
      autoProcess,
      processFunction,
      autoProcessDelay,
      clearError,
    ]
  );

  // Set output with side effects (persistence, URL sync)
  const setOutput = useCallback(
    (newOutput: R | undefined) => {
      setOutputState(newOutput);

      // Persist to localStorage if enabled
      if (persist && persistOutput && newOutput !== undefined) {
        storage.set(outputStorageKey, newOutput);
      }

      // Sync to URL if enabled
      if (syncWithUrl) {
        setUrlState({ [`${prefix}out`]: newOutput });
      }
    },
    [persistOutput, persist, outputStorageKey, syncWithUrl, setUrlState, prefix]
  );

  // Process the input to generate output
  const process = useCallback(async (): Promise<R | undefined> => {
    if (!processFunction) {
      console.warn("No process function provided for useUtilityState");
      return undefined;
    }

    try {
      setIsLoading(true);
      clearError();

      // Validate input if validation function is provided
      if (validateInput) {
        const validationResult = await validateInput(input);
        if (validationResult instanceof ValidationError) {
          throw validationResult;
        }
      }

      // Track utility usage
      if (trackUsage) {
        analytics.trackUtilityUsage(utilityId, utilityName);
        historyManager.addEntry({
          path: window.location.pathname,
          title: utilityName,
          data: { input },
        });
      }

      // Process the input
      const result = await processFunction(input);

      setOutput(result);
      setIsLoading(false);

      return result;
    } catch (err) {
      if (isMounted.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsLoading(false);

        // Track error
        if (trackUsage) {
          analytics.trackError(error.name, error.message, {
            utilityId,
            input:
              typeof input === "string"
                ? input.substring(0, 100)
                : "non-string input",
          });
        }
      }
      return undefined;
    }
  }, [
    processFunction,
    validateInput,
    input,
    trackUsage,
    utilityId,
    utilityName,
    setOutput,
    clearError,
    setError,
  ]);

  // Reset to initial state
  const reset = useCallback(() => {
    setInput(initialInput);
    setOutput(initialOutput);
    clearError();

    // Remove from localStorage if enabled
    if (persist) {
      if (persistInput) {
        storage.set(inputStorageKey, initialInput);
      }
      if (persistOutput && initialOutput !== undefined) {
        storage.set(outputStorageKey, initialOutput);
      } else if (persistOutput) {
        storage.remove(outputStorageKey);
      }
    }

    // Remove from URL if enabled
    if (syncWithUrl) {
      setUrlState({
        [`${prefix}in`]: initialInput,
        [`${prefix}out`]: initialOutput,
      });
    }
  }, [
    initialInput,
    initialOutput,
    setInput,
    setOutput,
    clearError,
    persist,
    persistInput,
    persistOutput,
    inputStorageKey,
    outputStorageKey,
    syncWithUrl,
    setUrlState,
    prefix,
  ]);

  // Clear only the output
  const clearOutput = useCallback(() => {
    setOutput(undefined);

    // Remove from localStorage if enabled
    if (persist && persistOutput) {
      storage.remove(outputStorageKey);
    }

    // Remove from URL if enabled
    if (syncWithUrl) {
      setUrlState({ [`${prefix}out`]: undefined });
    }
  }, [
    persist,
    persistOutput,
    outputStorageKey,
    syncWithUrl,
    setUrlState,
    prefix,
    setOutput,
  ]);

  // Get a shareable URL with the current state
  const getShareableUrl = useCallback(() => {
    const state: Record<string, any> = {};

    if (input !== initialInput) {
      state[`${prefix}in`] = input;
    }

    if (output !== undefined && output !== initialOutput) {
      state[`${prefix}out`] = output;
    }

    return UrlStateManager.getShareableUrl(state);
  }, [input, output, initialInput, initialOutput, prefix]);

  // Copy the shareable URL to clipboard
  const copyShareableUrl = useCallback(() => {
    const state: Record<string, any> = {};

    if (input !== initialInput) {
      state[`${prefix}in`] = input;
    }

    if (output !== undefined && output !== initialOutput) {
      state[`${prefix}out`] = output;
    }

    return UrlStateManager.copyShareableUrl(state);
  }, [input, output, initialInput, initialOutput, prefix]);

  return {
    // State
    input,
    output,
    isLoading,
    error,

    // Actions
    setInput,
    setOutput,
    process,
    reset,
    clearOutput,
    clearError,

    // Utility
    getShareableUrl,
    copyShareableUrl,
  };
}

export default useUtilityState;
