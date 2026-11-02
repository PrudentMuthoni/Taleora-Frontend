"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage } from "@/lib/errors";
import { projectApi } from "@/services/api";
import type { Project } from "@/types/api";
import { useGenerations } from "./useGenerations";
import { useProjects } from "./useProjects";

export function useProjectDetail(projectId: string) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generations = useGenerations({ projectId });
  const { projects } = useProjects();

  useEffect(() => {
    let cancelled = false;
    projectApi
      .get(projectId)
      .then((found) => {
        if (!cancelled) setProject(found);
      })
      .catch((caught) => {
        if (!cancelled) setError(errorMessage(caught));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const promptRename = useCallback(async () => {
    const next = window.prompt("Project name", project?.name ?? "")?.trim();
    if (!next) return;
    try {
      setProject(await projectApi.update(projectId, { name: next }));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, [projectId, project?.name]);

  const remove = useCallback(async () => {
    if (!window.confirm("Delete this project? Its videos stay in your library.")) return;
    try {
      await projectApi.remove(projectId);
      router.replace("/projects");
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, [projectId, router]);

  return { project, loading, error, generations, projects, promptRename, remove };
}

export type ProjectDetailModel = ReturnType<typeof useProjectDetail>;
