import { FolderOpen, FolderPlus } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { inputClass } from "@/components/ui/styles";
import type { useNewProjectForm } from "@/hooks/useNewProjectForm";
import { timeAgo } from "@/lib/format";
import type { Project } from "@/types/api";

interface Props {
  projects: Project[];
  loading: boolean;
  error: string | null;
  form: ReturnType<typeof useNewProjectForm>;
}

export function ProjectsView({ projects, loading, error, form }: Props) {
  return (
    <div className="space-y-6">
      <PageHeading title="Projects" subtitle="Group related videos together." />

      <Card>
        <form onSubmit={form.submit} className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="New project name"
            value={form.name}
            onChange={(event) => form.setName(event.target.value)}
            maxLength={120}
            placeholder="New project name"
            className={inputClass}
          />
          <Button type="submit" loading={form.busy} disabled={!form.name.trim()} className="sm:w-auto">
            <FolderPlus className="size-4" /> Create project
          </Button>
        </form>
        {form.error && <Alert tone="error" className="mt-3">{form.error}</Alert>}
      </Card>

      {error && <Alert tone="error">{error}</Alert>}
      {loading ? (
        <p className="text-sm text-muted">Loading projects…</p>
      ) : projects.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="rounded-3xl border border-line bg-surface p-5 shadow-card transition hover:border-brand">
              <span className="mb-3 grid size-11 place-items-center rounded-xl bg-chip text-accent">
                <FolderOpen className="size-5" />
              </span>
              <p className="truncate font-bold">{project.name}</p>
              <p className="mt-1 text-xs text-muted">Created {timeAgo(project.created_at)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={<FolderOpen className="size-6" />} title="No projects yet" text="Create one above, then add videos to it from the library." />
      )}
    </div>
  );
}
