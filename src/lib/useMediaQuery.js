import { useState, useEffect } from "react";

/**
 * Returns true if the viewport is at or below the given pixel width.
 * Updates on window resize. No external library — uses native matchMedia.
 *
 * Usage:
 *   const isMobile = useMediaQuery(768);
 *   return <div style={{ padding: isMobile ? 12 : 32 }}>...</div>;
 */
export default function useMediaQuery(maxWidth) {
  const query = `(max-width: ${maxWidth}px)`;
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const handler = e => setMatches(e.matches);
    mq.addEventListener("change", handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
