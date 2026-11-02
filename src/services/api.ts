import type {
  CreateGenerationInput,
  Generation,
  GenerationList,
  ProviderInfo,
  Project,
  RegisterInput,
  TokenResponse,
  Usage,
  User,
  VideoLink,
} from "@/types/api";
import { API_URL } from "./config";
import { request } from "./http";

export const authApi = {
  register: (input: RegisterInput) => request<User>("/auth/register", { method: "POST", json: input, auth: false }),
  login: (email: string, password: string) =>
    request<TokenResponse>("/auth/login", { method: "POST", json: { email, password }, auth: false }),
  me: () => request<User>("/auth/me"),
};

export const usageApi = {
  get: () => request<Usage>("/usage"),
};

export const projectApi = {
  list: () => request<Project[]>("/projects"),
  get: (id: string) => request<Project>(`/projects/${id}`),
  create: (name: string, description: string | null) =>
    request<Project>("/projects", { method: "POST", json: { name, description } }),
  update: (id: string, changes: { name?: string; description?: string | null }) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", json: changes }),
  remove: (id: string) => request<void>(`/projects/${id}`, { method: "DELETE" }),
};

export interface GenerationQuery {
  projectId?: string;
  limit?: number;
  offset?: number;
}

export const generationApi = {
  providers: () => request<ProviderInfo[]>("/generations/providers"),

  list(query: GenerationQuery = {}) {
    const params = new URLSearchParams();
    if (query.projectId) params.set("project_id", query.projectId);
    params.set("limit", String(query.limit ?? 24));
    params.set("offset", String(query.offset ?? 0));
    return request<GenerationList>(`/generations?${params.toString()}`);
  },

  get: (id: string) => request<Generation>(`/generations/${id}`),

  createText: (input: CreateGenerationInput) =>
    request<Generation>("/generations/text-to-video", { method: "POST", json: input }),

  createImage(input: CreateGenerationInput, image: File) {
    const form = new FormData();
    form.append("image", image);
    form.append("prompt", input.prompt);
    form.append("aspect_ratio", input.aspect_ratio);
    form.append("duration_seconds", String(input.duration_seconds));
    form.append("resolution", input.resolution);
    if (input.negative_prompt) form.append("negative_prompt", input.negative_prompt);
    if (input.project_id) form.append("project_id", input.project_id);
    if (input.seed !== null) form.append("seed", String(input.seed));
    if (input.provider) form.append("provider", input.provider);
    return request<Generation>("/generations/image-to-video", { method: "POST", body: form });
  },

  cancel: (id: string) => request<Generation>(`/generations/${id}/cancel`, { method: "POST" }),
  remove: (id: string) => request<void>(`/generations/${id}`, { method: "DELETE" }),
  setProject: (id: string, projectId: string | null) =>
    request<Generation>(`/generations/${id}`, { method: "PATCH", json: { project_id: projectId } }),

  async videoLink(id: string): Promise<VideoLink> {
    const link = await request<VideoLink>(`/generations/${id}/video-link`);
    return { ...link, url: `${API_URL}${link.url}` };
  },
};

export function downloadUrl(videoUrl: string): string {
  return `${videoUrl}&download=true`;
}
