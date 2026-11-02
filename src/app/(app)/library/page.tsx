"use client";

import { LibraryView } from "@/components/views/LibraryView";
import { useGenerations } from "@/hooks/useGenerations";
import { useProjects } from "@/hooks/useProjects";

export default function LibraryPage() {
  const model = useGenerations();
  const { projects } = useProjects();
  return <LibraryView model={model} projects={projects} />;
}
