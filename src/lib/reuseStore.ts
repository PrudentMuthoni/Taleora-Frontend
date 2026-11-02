import type { AspectRatio, GenerationMode, Resolution } from "@/types/api";

export interface ReusePayload {
  mode: GenerationMode;
  prompt: string;
  negativePrompt: string;
  aspectRatio: AspectRatio;
  duration: number;
  resolution: Resolution;
}

const KEY = "taleora-reuse";

export function saveReuse(payload: ReusePayload): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable: reuse simply does nothing */
  }
}

export function takeReuse(): ReusePayload | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as ReusePayload;
  } catch {
    return null;
  }
}
