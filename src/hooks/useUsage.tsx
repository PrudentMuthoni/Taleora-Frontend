"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usageApi } from "@/services/api";
import type { Usage } from "@/types/api";

interface UsageContextValue {
  usage: Usage | null;
  refreshUsage: () => Promise<void>;
}

const UsageContext = createContext<UsageContextValue | null>(null);

export function UsageProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<Usage | null>(null);

  const refreshUsage = useCallback(async () => {
    try {
      setUsage(await usageApi.get());
    } catch {
      /* the chip simply keeps its last value */
    }
  }, []);

  useEffect(() => {
    void refreshUsage();
  }, [refreshUsage]);

  const value = useMemo(() => ({ usage, refreshUsage }), [usage, refreshUsage]);
  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}

export function useUsage(): UsageContextValue {
  const context = useContext(UsageContext);
  if (!context) throw new Error("useUsage must be used inside UsageProvider");
  return context;
}
