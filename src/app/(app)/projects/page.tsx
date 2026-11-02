"use client";

import { ProjectsView } from "@/components/views/ProjectsView";
import { useNewProjectForm } from "@/hooks/useNewProjectForm";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { projects, loading, error, create } = useProjects();
  const form = useNewProjectForm(create);
  return <ProjectsView projects={projects} loading={loading} error={error} form={form} />;
}
