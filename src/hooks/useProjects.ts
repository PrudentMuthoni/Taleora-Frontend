"use client";

import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "@/lib/errors";
import { projectApi } from "@/services/api";
import type { Project } from "@/types/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setProjects(await projectApi.list());
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (name: string, description: string | null) => {
    const project = await projectApi.create(name.trim(), description);
    setProjects((current) => [project, ...current]);
    return project;
  }, []);

  return { projects, loading, error, refresh, create };
}
