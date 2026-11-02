import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "error" | "success" | "info" | "warn";

const tones: Record<Tone, string> = {
  error: "bg-bad-bg text-bad-fg",
  success: "bg-ok-bg text-ok-fg",
  info: "bg-chip text-accent",
  warn: "bg-warn-bg text-warn-fg",
};

export function Alert({ tone = "info", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-2xl px-4 py-3 text-sm font-medium", tones[tone], className)}>
      {children}
    </div>
  );
}
