import { cn } from "@/lib/cn";

/** Replace public/logo.svg with your own mark. */
export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xl font-extrabold tracking-tight", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" className="size-7" />
      {showWord && <span>Taleora</span>}
    </span>
  );
}
