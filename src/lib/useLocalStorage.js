import { useState, useEffect, useRef } from "react";

/**
 * A drop-in replacement for useState that persists to localStorage.
 *
 *   const [history, setHistory] = useLocalStorage("trainerHistory", []);
 *
 * Reads on mount (with the initialValue as fallback), and writes on every
 * change. Handles JSON parse failures gracefully (corrupted entry → reset
 * to initialValue and log to console).
 *
 * The first write is suppressed (so an unchanged mount doesn't overwrite
 * existing data with the same value or trigger needless storage churn).
 */
export default function useLocalStorage(key, initialValue) {
  const STORAGE_PREFIX = "shovelab.";
  const fullKey = STORAGE_PREFIX + key;

  // Lazy initializer reads from storage on first render
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(fullKey);
      if (raw === null) return initialValue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`useLocalStorage: failed to read '${fullKey}', resetting.`, err);
      return initialValue;
    }
  });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip the very first effect so we don't immediately re-write
    // what we just read.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (err) {
      // QuotaExceeded or private-mode safari — fail silently rather than crash
      console.warn(`useLocalStorage: failed to write '${fullKey}'.`, err);
    }
  }, [fullKey, value]);

  return [value, setValue];
}

/**
 * Wipe all Shove·Lab data from localStorage. Used by the "Clear all data"
 * button in Session Review.
 */
export function clearAllStoredData() {
  if (typeof window === "undefined") return;
  const STORAGE_PREFIX = "shovelab.";
  const keysToRemove = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
  }
  keysToRemove.forEach(k => window.localStorage.removeItem(k));
}
