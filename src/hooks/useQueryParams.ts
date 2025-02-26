import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParamValues = Record<string, QueryParamValue>;

interface QueryParamsOptions {
  replace?: boolean;
  defaults?: QueryParamValues;
  serialize?: (value: QueryParamValue) => string | null;
  deserialize?: (value: string) => QueryParamValue;
}

// Default serializer/deserializer functions
const defaultSerialize = (value: QueryParamValue): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? '1' : '0';
  return String(value);
};

const defaultDeserialize = (value: string): QueryParamValue => {
  if (value === '0') return false;
  if (value === '1') return true;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === 'undefined') return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
};

/**
 * Custom hook to sync state with URL query parameters
 */
function useQueryParams<T extends QueryParamValues = QueryParamValues>(
  initialState: T,
  options: QueryParamsOptions = {}
): [T, (newState: Partial<T>) => void] {
  const {
    replace = false,
    defaults = {},
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<T>(() => {
    // Initialize with values from URL or defaults
    const stateFromUrl: Partial<T> = {};
    
    // Get values from URL for each key in initialState
    Object.keys(initialState).forEach((key) => {
      const urlValue = searchParams.get(key);
      if (urlValue !== null) {
        (stateFromUrl as any)[key] = deserialize(urlValue);
      } else if (key in defaults) {
        // Use default if provided and not in URL
        (stateFromUrl as any)[key] = defaults[key];
      } else {
        // Fall back to initialState
        (stateFromUrl as any)[key] = initialState[key];
      }
    });

    return { ...initialState, ...stateFromUrl } as T;
  });

  // Sync URL params to state when URL changes
  useEffect(() => {
    const newState: Partial<T> = { ...state };
    let hasChanges = false;

    Object.keys(initialState).forEach((key) => {
      const urlValue = searchParams.get(key);
      if (urlValue !== null) {
        const deserializedValue = deserialize(urlValue);
        if ((state as any)[key] !== deserializedValue) {
          (newState as any)[key] = deserializedValue;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setState((prevState) => ({ ...prevState, ...newState }));
    }
  }, [searchParams, initialState]);

  // Update state and URL
  const updateState = useCallback(
    (newState: Partial<T>) => {
      // Update local state
      setState((prevState) => ({ ...prevState, ...newState }));

      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      
      Object.entries(newState).forEach(([key, value]) => {
        const serialized = serialize(value);
        if (serialized === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, serialized);
        }
      });

      setSearchParams(newParams, { replace });
    },
    [searchParams, setSearchParams, serialize, replace]
  );

  return [state, updateState];
}

export default useQueryParams;
