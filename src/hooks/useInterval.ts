import { useEffect, useRef } from "react";

/** Runs `callback` every `delay` ms. Pass null to pause. */
export function useInterval(callback: () => void | Promise<void>, delay: number | null): void {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => {
      void saved.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
