"use client";

import { useEffect, useState } from "react";
import { generationApi } from "@/services/api";
import type { ProviderInfo } from "@/types/api";

export function useProviders() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    generationApi
      .providers()
      .then((list) => {
        if (!cancelled) setProviders(list);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { providers, loading };
}
