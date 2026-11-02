// Mirrors the Taleora backend schemas.

export type GenerationMode = "text_to_video" | "image_to_video";
export type GenerationStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";
export type AspectRatio = "16:9" | "9:16" | "1:1";
export type Resolution = "480p" | "720p";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  project_id: string | null;
  mode: GenerationMode;
  prompt: string;
  negative_prompt: string | null;
  provider: string;
  model: string | null;
  aspect_ratio: string;
  duration_seconds: number;
  resolution: string;
  seed: number | null;
  status: GenerationStatus;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface GenerationList {
  items: Generation[];
  total: number;
  limit: number;
  offset: number;
}

export interface VideoLink {
  url: string;
  expires_in: number;
}

export interface ProviderInfo {
  name: string;
  configured: boolean;
  modes: GenerationMode[];
  default_models: Record<string, string>;
}

export interface Usage {
  used_today: number;
  daily_limit: number;
  remaining_today: number;
  active_jobs: number;
  max_concurrent_jobs: number;
}

export interface CreateGenerationInput {
  prompt: string;
  negative_prompt: string | null;
  project_id: string | null;
  aspect_ratio: AspectRatio;
  duration_seconds: number;
  resolution: Resolution;
  seed: number | null;
  provider: string | null;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string | null;
}
