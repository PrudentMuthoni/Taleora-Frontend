import type { TokenResponse } from "@/types/api";
import { API_URL } from "./config";
import { tokenStore } from "./tokenStore";

export const SIGNED_OUT_EVENT = "taleora:signed-out";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  body?: BodyInit | null;
  auth?: boolean;
}

let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!response.ok) {
      tokenStore.clear();
      return false;
    }
    tokenStore.set((await response.json()) as TokenResponse);
    return true;
  } catch {
    return false;
  }
}

function refreshOnce(): Promise<boolean> {
  if (!refreshing) {
    refreshing = refreshTokens().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const { json, auth = true, headers: extraHeaders, ...init } = options;
  const headers = new Headers(extraHeaders);
  if (auth) {
    const token = tokenStore.getAccess();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  let body = init.body ?? null;
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }
  try {
    return await fetch(`${API_URL}${path}`, { ...init, headers, body, cache: "no-store" });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }
}

async function toError(response: Response): Promise<ApiError> {
  let message = `Request failed (${response.status})`;
  let code: string | undefined;
  try {
    const data = await response.json();
    if (data?.error?.message) {
      message = data.error.message;
      code = data.error.code;
    } else if (typeof data?.detail === "string") {
      message = data.detail;
    }
  } catch {
    /* body was not JSON */
  }
  return new ApiError(response.status, message, code);
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response = await send(path, options);

  if (response.status === 401 && options.auth !== false) {
    if (await refreshOnce()) {
      response = await send(path, options);
    }
    if (response.status === 401 && typeof window !== "undefined") {
      tokenStore.clear();
      window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
    }
  }

  if (!response.ok) throw await toError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
