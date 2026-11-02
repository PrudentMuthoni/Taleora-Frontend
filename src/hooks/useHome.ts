"use client";

import { greeting } from "@/lib/format";
import { useAuth } from "./useAuth";
import { useGenerations } from "./useGenerations";
import { useProjects } from "./useProjects";
import { useUsage } from "./useUsage";

export function useHome() {
  const { user } = useAuth();
  const { usage } = useUsage();
  const { projects } = useProjects();
  const generations = useGenerations({ pageSize: 4 });
  const firstName = user?.full_name?.trim().split(" ")[0] || "there";

  return { greeting: greeting(), firstName, usage, projects, generations };
}

export type HomeModel = ReturnType<typeof useHome>;
