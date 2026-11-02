import { Check, Clapperboard, Play, RotateCcw, Download, X } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button, buttonClass } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { StatusPill } from "@/components/ui/StatusPill";
import { selectClass } from "@/components/ui/styles";
import type { CreateVideoModel } from "@/hooks/useCreateVideo";
import { cn } from "@/lib/cn";
import { formatElapsed } from "@/lib/format";
import { downloadUrl } from "@/services/api";

const FRAME: Record<string, string> = {
  "16:9": "aspect-video w-full",
  "9:16": "mx-auto aspect-[9/16] max-h-[60vh]",
  "1:1": "mx-auto aspect-square max-h-[60vh]",
};

function Step({ state, label }: { state: "done" | "active" | "todo"; label: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-semibold">
      <span
        className={cn(
          "grid size-6 place-items-center rounded-full border-2",
          state === "done" && "border-brand bg-brand text-white",
          state === "active" && "border-brand text-accent",
          state === "todo" && "border-line text-muted",
        )}
      >
        {state === "done" && <Check className="size-3.5" />}
        {state === "active" && <Spinner className="size-3.5" />}
      </span>
      <span className={state === "todo" ? "text-muted" : undefined}>{label}</span>
    </li>
  );
}

export function PreviewPanel({ model }: { model: CreateVideoModel }) {
  const { job, jobActive, videoUrl, aspectRatio, elapsedSeconds, projects } = model;
  const frame = cn("overflow-hidden rounded-2xl bg-surface-2", FRAME[job?.aspect_ratio ?? aspectRatio] ?? FRAME["16:9"]);

  return (
    <Card className="space-y-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Preview</h2>
        {job && <StatusPill status={job.status} />}
      </div>

      {!job && (
        <div className={cn(frame, "grid place-items-center p-6 text-center")}>
          <div className="flex flex-col items-center gap-3 text-muted">
            <span className="grid size-14 place-items-center rounded-full bg-chip text-accent">
              <Play className="size-6 translate-x-0.5" fill="currentColor" />
            </span>
            <p className="text-sm font-semibold">Your video will appear here</p>
          </div>
        </div>
      )}

      {job && jobActive && (
        <>
          <div className={cn(frame, "grid place-items-center")}>
            <div className="flex flex-col items-center gap-3">
              <Spinner className="size-12 text-brand" />
              <p className="text-sm font-semibold">{job.status === "queued" ? "You're in the queue" : "Creating your video"}</p>
              <p className="text-xs text-muted tabular-nums">{formatElapsed(elapsedSeconds)} elapsed</p>
            </div>
          </div>
          <ol className="space-y-3">
            <Step state={job.status === "queued" ? "active" : "done"} label="Queued" />
            <Step state={job.status === "processing" ? "active" : "todo"} label="Processing" />
            <Step state="todo" label="Ready" />
          </ol>
          <p className="text-xs text-muted">You can leave this page. The video will be waiting in your library.</p>
          <Button variant="secondary" className="w-full" onClick={model.cancel}>
            <X className="size-4" /> Cancel generation
          </Button>
        </>
      )}

      {job?.status === "completed" && (
        <>
          <div className={frame}>
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay playsInline className="size-full bg-black object-contain" />
            ) : (
              <div className="grid size-full place-items-center">
                <Spinner className="size-8 text-accent" />
              </div>
            )}
          </div>
          {videoUrl && (
            <a href={downloadUrl(videoUrl)} className={buttonClass("primary", "md", "w-full")}>
              <Download className="size-4" /> Download MP4
            </a>
          )}
          <select
            aria-label="Add to project"
            value={job.project_id ?? ""}
            onChange={(event) => model.assignToProject(event.target.value)}
            className={selectClass}
          >
            <option value="">Not in a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                Add to {project.name}
              </option>
            ))}
          </select>
          <Button variant="secondary" className="w-full" onClick={model.startOver}>
            <Clapperboard className="size-4" /> Make another
          </Button>
        </>
      )}

      {job?.status === "failed" && (
        <>
          <Alert tone="error">{job.error_message ?? "The video couldn't be created."}</Alert>
          <Button variant="secondary" className="w-full" onClick={model.startOver}>
            <RotateCcw className="size-4" /> Try again
          </Button>
        </>
      )}

      {job?.status === "cancelled" && (
        <>
          <Alert>This generation was cancelled.</Alert>
          <Button variant="secondary" className="w-full" onClick={model.startOver}>
            <RotateCcw className="size-4" /> Start over
          </Button>
        </>
      )}
    </Card>
  );
}
