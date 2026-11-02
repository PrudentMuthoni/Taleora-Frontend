import { ArrowLeft, Film, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { GenerationGrid } from "@/components/library/GenerationGrid";
import type { ProjectDetailModel } from "@/hooks/useProjectDetail";

export function ProjectDetailView({ model }: { model: ProjectDetailModel }) {
  const { project, generations } = model;

  if (model.loading) return <p className="text-sm text-muted">Loading project…</p>;
  if (!project) {
    return (
      <div className="space-y-4">
        <Alert tone="error">{model.error ?? "Project not found."}</Alert>
        <Link href="/projects" className="text-sm font-bold text-accent hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-bold text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Projects
      </Link>
      <PageHeading
        title={project.name}
        subtitle={project.description ?? undefined}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={model.promptRename}>
              <Pencil className="size-4" /> Rename
            </Button>
            <Button variant="danger" size="sm" onClick={model.remove}>
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        }
      />
      {(model.error || generations.error) && <Alert tone="error">{model.error ?? generations.error}</Alert>}
      {generations.items.length ? (
        <GenerationGrid items={generations.items} projects={model.projects} actions={generations} />
      ) : (
        <EmptyState
          icon={<Film className="size-6" />}
          title="No videos in this project"
          text="Open a video in your library and choose this project from its menu."
        />
      )}
    </div>
  );
}
