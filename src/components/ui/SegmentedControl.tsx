import { cn } from "@/lib/cn";
import { Badge } from "./Badge";

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  badge?: string;
  disabled?: boolean;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex gap-2", className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-not-allowed",
              selected ? "border-brand bg-chip text-accent" : "border-line bg-surface text-fg hover:bg-surface-2",
              option.disabled && "text-muted hover:bg-surface",
            )}
          >
            {option.label}
            {option.badge && <Badge>{option.badge}</Badge>}
          </button>
        );
      })}
    </div>
  );
}
