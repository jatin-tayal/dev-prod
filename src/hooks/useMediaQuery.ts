import { useState, useEffect } from 'react';

/**
 * Hook for responsive design using media queries
 * @param query The media query to match (e.g., '(min-width: 768px)')
 * @returns Boolean indicating whether the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Avoid SSR issues
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    
    // Update the state initially
    setMatches(media.matches);
    
    // Define callback for media query change
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add listener for subsequent changes
    media.addEventListener('change', listener);
    
    // Clean up
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Predefined media query breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

export default useMediaQuery;
