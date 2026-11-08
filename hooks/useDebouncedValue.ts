"use client";

import { useEffect, useState } from "react";

/**
 * A value that only updates once the caller has stopped changing it.
 *
 * Search inputs fire on every keystroke. If each keystroke re-runs an
 * expensive filter — over a thousand rows, say — the input starts to lag
 * behind the keyboard. Debouncing the value that the filter actually reads
 * keeps the input responsive and does the work once, when the user pauses.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
