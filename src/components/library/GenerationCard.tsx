"use client";

import { Ban, Download, Play, RotateCcw, Trash2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StatusPill } from "@/components/ui/StatusPill";
import { selectClass } from "@/components/ui/styles";
import type { GenerationsModel } from "@/hooks/useGenerations";
import { MODE_LABEL, generationSummary, isActive, timeAgo } from "@/lib/format";
import type { Generation, Project } from "@/types/api";

export type GenerationActions = Pick<
  GenerationsModel,
  "cancel" | "remove" | "assignProject" | "download" | "getVideoUrl" | "reuse"
>;

interface Props {
  generation: Generation;
  projects: Project[];
  actions: GenerationActions;
}

export function GenerationCard({ generation: g, projects, actions }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playFailed, setPlayFailed] = useState(false);

  async function play() {
    setLoading(true);
    setPlayFailed(false);
    try {
      setVideoUrl(await actions.getVideoUrl(g.id));
    } catch {
      setPlayFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      <div className="relative aspect-video bg-surface-2">
        {videoUrl ? (
          <video src={videoUrl} controls autoPlay playsInline className="size-full bg-black object-contain" />
        ) : g.status === "completed" ? (
          <button
            type="button"
            onClick={play}
            aria-label="Play video"
            className="grid size-full place-items-center bg-linear-to-br from-brand/30 to-surface-2"
          >
            {loading ? (
              <Spinner className="size-8 text-accent" />
            ) : (
              <span className="grid size-14 place-items-center rounded-full bg-brand-gradient text-white shadow-glow">
                <Play className="size-6 translate-x-0.5" fill="currentColor" />
              </span>
            )}
            {playFailed && <span className="absolute bottom-2 text-xs font-semibold text-bad-fg">Couldn&apos;t load the video. Tap to retry.</span>}
          </button>
        ) : (
          <div className="grid size-full place-items-center p-4 text-center text-sm text-muted">
            {isActive(g.status) && (
              <div className="flex flex-col items-center gap-2">
                <Spinner className="size-7 text-accent" />
                {g.status === "queued" ? "Waiting in the queue" : "Creating your video"}
              </div>
            )}
            {g.status === "failed" && (
              <div className="flex flex-col items-center gap-2 text-bad-fg">
                <TriangleAlert className="size-7" />
                <span className="line-clamp-3">{g.error_message ?? "Generation failed."}</span>
              </div>
            )}
            {g.status === "cancelled" && (
              <div className="flex flex-col items-center gap-2">
                <Ban className="size-7" />
                Cancelled
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm font-semibold">{g.prompt}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <StatusPill status={g.status} />
          <span>{MODE_LABEL[g.mode]}</span>
          <span>·</span>
          <span>{generationSummary(g)}</span>
          <span>·</span>
          <span>{timeAgo(g.created_at)}</span>
        </div>

        <select
          aria-label="Project"
          value={g.project_id ?? ""}
          onChange={(event) => actions.assignProject(g.id, event.target.value || null)}
          className={`${selectClass} min-h-10 text-sm`}
        >
          <option value="">No project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <div className="mt-auto flex flex-wrap gap-2">
          {g.status === "completed" && (
            <Button size="sm" variant="secondary" onClick={() => actions.download(g.id)}>
              <Download className="size-4" /> Download
            </Button>
          )}
          {isActive(g.status) && (
            <Button size="sm" variant="secondary" onClick={() => actions.cancel(g.id)}>
              <X className="size-4" /> Cancel
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => actions.reuse(g)}>
            <RotateCcw className="size-4" /> Reuse
          </Button>
          {!isActive(g.status) && (
            <Button size="sm" variant="danger" onClick={() => actions.remove(g.id)} aria-label="Delete video">
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
