import { useState, useCallback } from "react";

interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  copied: boolean;
  error: Error | null;
}

/**
 * Hook for copying text to clipboard
 * @returns Object containing copyToClipboard function, copied state, and error state
 */
const useClipboard = (): UseClipboardReturn => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (!navigator?.clipboard) {
          throw new Error("Clipboard API not supported in this browser");
        }

        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        // Reset "copied" state after 2 seconds
        setTimeout(() => setCopied(false), 2000);

        return true;
      } catch (err) {
        setCopied(false);
        setError(err instanceof Error ? err : new Error("Failed to copy"));
        return false;
      }
    },
    []
  );

  return { copyToClipboard, copied, error };
};

export default useClipboard;
