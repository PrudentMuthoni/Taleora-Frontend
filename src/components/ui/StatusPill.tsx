import { cn } from "@/lib/cn";
import { STATUS_LABEL } from "@/lib/format";
import type { GenerationStatus } from "@/types/api";

const tones: Record<GenerationStatus, string> = {
  queued: "bg-warn-bg text-warn-fg",
  processing: "bg-warn-bg text-warn-fg",
  completed: "bg-ok-bg text-ok-fg",
  failed: "bg-bad-bg text-bad-fg",
  cancelled: "bg-chip text-muted",
};

export function StatusPill({ status }: { status: GenerationStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", tones[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}
