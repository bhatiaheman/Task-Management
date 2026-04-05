import type { PaginatedTasks, Task, User } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const ACCESS_KEY = "tm_access";
const USER_KEY = "tm_user";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_KEY);
}

export function setSessionAuth(accessToken: string | null, user: User | null) {
  if (typeof window === "undefined") return;
  if (accessToken) sessionStorage.setItem(ACCESS_KEY, accessToken);
  else sessionStorage.removeItem(ACCESS_KEY);
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

async function refreshTokens(): Promise<{ accessToken: string; user: User } | null> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { accessToken: string; user: User };
  setSessionAuth(body.accessToken, body.user);
  return body;
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return apiFetch(path, init, false);
    }
  }

  return res;
}

export async function registerRequest(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Registration failed");
  }
  const body = data as { accessToken: string; user: User };
  setSessionAuth(body.accessToken, body.user);
  return body;
}

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Login failed");
  }
  const body = data as { accessToken: string; user: User };
  setSessionAuth(body.accessToken, body.user);
  return body;
}

export async function logoutRequest() {
  const res = await apiFetch("/auth/logout", { method: "POST" });
  setSessionAuth(null, null);
  if (!res.ok && res.status !== 401) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Logout failed");
  }
}

export async function fetchTasks(params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}): Promise<PaginatedTasks> {
  const sp = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.status) sp.set("status", params.status);
  if (params.search?.trim()) sp.set("search", params.search.trim());
  const res = await apiFetch(`/tasks?${sp.toString()}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Failed to load tasks");
  }
  return res.json() as Promise<PaginatedTasks>;
}

export async function createTask(body: {
  title: string;
  description?: string;
  status?: Task["status"];
}): Promise<Task> {
  const res = await apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Could not create task");
  }
  return res.json() as Promise<Task>;
}

export async function updateTask(
  id: string,
  body: Partial<{ title: string; description: string | null; status: Task["status"] }>,
): Promise<Task> {
  const res = await apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Could not update task");
  }
  return res.json() as Promise<Task>;
}

export async function deleteTask(id: string): Promise<void> {
  const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Could not delete task");
  }
}

export async function toggleTask(id: string): Promise<Task> {
  const res = await apiFetch(`/tasks/${id}/toggle`, { method: "POST" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Could not toggle task");
  }
  return res.json() as Promise<Task>;
}
