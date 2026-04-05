"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAccessToken,
  getStoredUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  setSessionAuth,
} from "@/lib/api";
import type { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function tryRestoreSession(): Promise<User | null> {
  const token = getAccessToken();
  const user = getStoredUser();
  if (token && user) return user;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/auth/refresh`,
    { method: "POST", credentials: "include" },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as { accessToken: string; user: User };
  setSessionAuth(body.accessToken, body.user);
  return body.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const u = await tryRestoreSession();
      if (live) {
        setUser(u);
        setReady(true);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u } = await loginRequest(email, password);
    setUser(u);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { user: u } = await registerRequest(email, password);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
