import type { Usage } from "@/types/api";

export function UsageMeter({ usage }: { usage: Usage | null }) {
  const percent = usage ? Math.min(100, (usage.used_today / Math.max(1, usage.daily_limit)) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold">{usage ? `${usage.used_today} of ${usage.daily_limit} today` : "Loading usage"}</span>
        <span className="text-xs text-muted">{usage ? `${usage.remaining_today} left` : ""}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Daily generations used" aria-valuenow={usage?.used_today ?? 0} aria-valuemin={0} aria-valuemax={usage?.daily_limit ?? 0}>
        <div className="h-full rounded-full bg-brand-gradient transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs text-muted">Resets at midnight UTC</p>
    </div>
  );
}
