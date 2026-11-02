import type { Generation, GenerationMode, GenerationStatus } from "@/types/api";

export const STATUS_LABEL: Record<GenerationStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  completed: "Ready",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const MODE_LABEL: Record<GenerationMode, string> = {
  text_to_video: "Text to video",
  image_to_video: "Image to video",
};

export function isActive(status: GenerationStatus): boolean {
  return status === "queued" || status === "processing";
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function generationSummary(generation: Generation): string {
  return `${generation.aspect_ratio} · ${generation.duration_seconds} s · ${generation.resolution}`;
}
