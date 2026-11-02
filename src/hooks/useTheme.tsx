"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/lib/constants";

export type ThemePreference = "system" | "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference;
  isDark: boolean;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const DARK_QUERY = "(prefers-color-scheme: dark)";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isDark, setIsDark] = useState(false);

  const apply = useCallback((value: ThemePreference) => {
    const dark = value === "dark" || (value === "system" && window.matchMedia(DARK_QUERY).matches);
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  useEffect(() => {
    let stored: ThemePreference = "system";
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      if (value === "light" || value === "dark" || value === "system") stored = value;
    } catch {
      /* storage unavailable */
    }
    setPreferenceState(stored);
    apply(stored);
  }, [apply]);

  useEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference, apply]);

  const setPreference = useCallback(
    (value: ThemePreference) => {
      setPreferenceState(value);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch {
        /* storage unavailable */
      }
      apply(value);
    },
    [apply],
  );

  const toggle = useCallback(() => setPreference(isDark ? "light" : "dark"), [isDark, setPreference]);

  const value = useMemo(
    () => ({ preference, isDark, setPreference, toggle }),
    [preference, isDark, setPreference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
