"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LIST_POLL_INTERVAL_MS } from "@/lib/constants";
import { errorMessage } from "@/lib/errors";
import { isActive } from "@/lib/format";
import { saveReuse } from "@/lib/reuseStore";
import { downloadUrl, generationApi } from "@/services/api";
import type { AspectRatio, Generation, Resolution } from "@/types/api";
import { useInterval } from "./useInterval";

export type LibraryTab = "all" | "completed" | "active" | "failed";

interface Options {
  projectId?: string;
  pageSize?: number;
}

const MAX_PAGE = 100;

export function useGenerations({ projectId, pageSize = 24 }: Options = {}) {
  const router = useRouter();
  const [tab, setTab] = useState<LibraryTab>("all");
  const [items, setItems] = useState<Generation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (count?: number) => {
      try {
        const data = await generationApi.list({ projectId, limit: Math.min(MAX_PAGE, count ?? pageSize), offset: 0 });
        setItems(data.items);
        setTotal(data.total);
        setError(null);
      } catch (caught) {
        setError(errorMessage(caught));
      } finally {
        setLoading(false);
      }
    },
    [projectId, pageSize],
  );

  useEffect(() => {
    setLoading(true);
    void refresh();
  }, [refresh]);

  const hasActive = items.some((item) => isActive(item.status));
  useInterval(() => refresh(Math.max(items.length, pageSize)), hasActive ? LIST_POLL_INTERVAL_MS : null);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await generationApi.list({ projectId, limit: pageSize, offset: items.length });
      setItems((current) => [...current, ...data.items]);
      setTotal(data.total);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoadingMore(false);
    }
  }, [projectId, pageSize, items.length]);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (tab === "completed") return item.status === "completed";
        if (tab === "active") return isActive(item.status);
        if (tab === "failed") return item.status === "failed" || item.status === "cancelled";
        return true;
      }),
    [items, tab],
  );

  const replace = useCallback((updated: Generation) => {
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  const cancel = useCallback(
    async (id: string) => {
      try {
        replace(await generationApi.cancel(id));
      } catch (caught) {
        setError(errorMessage(caught));
      }
    },
    [replace],
  );

  const remove = useCallback(async (id: string) => {
    if (!window.confirm("Delete this video? This can't be undone.")) return;
    try {
      await generationApi.remove(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setTotal((current) => Math.max(0, current - 1));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, []);

  const assignProject = useCallback(
    async (id: string, target: string | null) => {
      try {
        const updated = await generationApi.setProject(id, target);
        if (projectId && updated.project_id !== projectId) {
          setItems((current) => current.filter((item) => item.id !== id));
        } else {
          replace(updated);
        }
      } catch (caught) {
        setError(errorMessage(caught));
      }
    },
    [projectId, replace],
  );

  const getVideoUrl = useCallback(async (id: string) => (await generationApi.videoLink(id)).url, []);

  const download = useCallback(async (id: string) => {
    try {
      window.location.assign(downloadUrl(await getVideoUrl(id)));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, [getVideoUrl]);

  const reuse = useCallback(
    (generation: Generation) => {
      saveReuse({
        mode: generation.mode,
        prompt: generation.prompt,
        negativePrompt: generation.negative_prompt ?? "",
        aspectRatio: generation.aspect_ratio as AspectRatio,
        duration: generation.duration_seconds,
        resolution: generation.resolution as Resolution,
      });
      router.push("/create");
    },
    [router],
  );

  return {
    tab,
    setTab,
    items: visible,
    total,
    hasMore: items.length < total,
    loading,
    loadingMore,
    error,
    loadMore,
    cancel,
    remove,
    assignProject,
    download,
    getVideoUrl,
    reuse,
  };
}

export type GenerationsModel = ReturnType<typeof useGenerations>;
